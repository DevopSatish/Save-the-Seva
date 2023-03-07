import pyrebase
from django.conf import settings
from rest_framework import status as HTTPResponseStatus
from rest_framework.decorators import api_view
from rest_framework.response import Response
from twilio.rest import Client

from core.enum import OrderStatus
from core.models import Aadhaar, Operator, Order, Service, ShiftCashCollection
from core.serializer import OperatorSerializer
from core.service.payment_link import create_payment_link
from core.service.sms import trigger_twilio_sms

firebase_config = {
    
    "databaseURL": "https://aadhaar-payment-recon.asia-northeast3.firebasedatabase.app",
    "apiKey": "AIzaSyBw1nOGYJdPzJj7ts63ZHHBsWYpNrPi1sg",
    "authDomain": "satishfinalyearproject.firebaseapp.com",
    "projectId": "satishfinalyearproject",
    "storageBucket": "satishfinalyearproject.appspot.com",
    "messagingSenderId": "703717130667",
    "appId": "1:703717130667:web:2ab96c5a862777d349d2ee",
    "measurementId": "G-VVFWB424NJ"
}

firebase = pyrebase.initialize_app(firebase_config)
firebase_auth = firebase.auth()

twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


@api_view(["GET"])
def health_check(request):
    return Response({"ping": "pong"}, HTTPResponseStatus.HTTP_200_OK)


@api_view(["POST"])
def send_sms(request):
    to_number = request.data.get("to_number")
    body = request.data.get("body")
    api_token_provided = request.META.get("HTTP_API_TOKEN")
    if api_token_provided != settings.API_TOKEN:
        return Response("Unauthorized", status=HTTPResponseStatus.HTTP_401_UNAUTHORIZED)

    message_sid = trigger_twilio_sms(to_number, body)
    return Response({"message_sid": message_sid})


@api_view(["GET"])
def get_payment_link(request):
    data = dict(request.query_params)
    for k, v in data.items():
        data[k] = v[0]
    customer_phone = str(data.get("customer_phone"))
    customer_name = data.get("customer_name")
    customer_email = data.get("customer_email")
    operator_id = int(data.get("operator_id"))
    service_id_list = list(map(lambda x: int(x), str(data.get("service_id_list")).split(",")))
    service_object_list = Service.objects.filter(id__in=service_id_list)
    amount = 0
    for service_object in service_object_list:
        amount += service_object.cost
    payment_link, order_id = create_payment_link(
        amount, customer_phone, operator_id, service_id_list, customer_name, customer_email
    )
    aadhaar_instance = Aadhaar.objects.filter(phone_number=customer_phone)
    if len(aadhaar_instance) > 0:
        aadhaar_instance = aadhaar_instance[0]

    if len(customer_phone) == 10:
        customer_phone = f"+91${customer_phone}"
    try:
        message_sid = trigger_twilio_sms(
            customer_phone, f"Please pay ${amount} INR to the operator. Payment link: ${payment_link}"
        )
    except Exception as ex:
        print(f"Error: ${str(ex)}")
    finally:
        return Response({"payment_link": payment_link})


@api_view(["POST"])
def pg_success_callback(request):
    data = request.data["data"]
    print(data)
    if not "link_amount" in data:
        transaction_id = data["order"]["order_id"]
        link_id = data["order"]["order_tags"]["link_id"]
        payment_status = data["payment"]["payment_status"]
        if payment_status == "SUCCESS":
            Order.objects.filter(uuid=link_id).update(pg_txn_id=transaction_id, status=OrderStatus.SUCCESS.value)
            customer_phone_number = Order.objects.filter(uuid=link_id).values_list("customer_phone", flat=True)
            customer_phone_number = set(customer_phone_number).pop()
            aadhaar_instance_list = Aadhaar.objects.filter(phone_number=customer_phone_number)
            for aadhaar_instance in aadhaar_instance_list:
                requested_changes = aadhaar_instance.requested_changes
                if len(requested_changes) >= 1:
                    new_address = requested_changes.get("address")
                    aadhaar_instance.address = new_address
                    aadhaar_instance.requested_changes = {}
                    aadhaar_instance.save()
        else:
            Order.objects.filter(uuid=link_id).update(pg_txn_id=transaction_id, status=OrderStatus.FAILED.value)
        return Response({"message": "updated"}, status=HTTPResponseStatus.HTTP_200_OK)
    else:
        return Response({"message": "ignored"}, status=HTTPResponseStatus.HTTP_200_OK)


@api_view(["POST"])
def create_user(request):
    data = request.data
    name = data.get("name")
    booth = data.get("booth")
    email = data.get("email")
    password = data.get("password")
    centre = data.get("centre")
    role = data.get("role", "OPERATOR")
    user = firebase_auth.create_user_with_email_and_password(email, password)
    firebase_uid = user.get("localId")
    operator = Operator.objects.create(
        name=name, booth=booth, active_centre_id=centre, role=role, firebase_uid=firebase_uid
    )
    serializer_data = OperatorSerializer(operator)
    return Response(serializer_data.data, status=HTTPResponseStatus.HTTP_200_OK)


@api_view(["POST"])
def recon_diff(request):
    data = request.data
    date = str(data.get("date"))
    date_arr = date.split("-")
    year = date_arr[0]
    month = date_arr[1]
    day = date_arr[2]
    uuid_total_amount_map_expected = {}

    offline_order_list_expected = Order.objects.filter(
        mode_of_payment="OFFLINE",
        status="SUCCESS",
        updated_at__year=year,
        updated_at__month=month,
        updated_at__day=day,
    )
    for offline_order in offline_order_list_expected:
        uuid_total_amount_map_expected[str(offline_order.uuid)] = {
            "amount_collected": offline_order.amount_collected,
            "operator": offline_order.operator_id,
        }

    operator_expected_amount_map = {}
    for _, amount_operator_map in uuid_total_amount_map_expected.items():
        operator_id = amount_operator_map.get("operator")
        amount_collected = amount_operator_map.get("amount_collected")
        if operator_id not in operator_expected_amount_map:
            operator_expected_amount_map[operator_id] = 0

        operator_expected_amount_map[operator_id] += amount_collected

    final_operator_diff_list = []

    for operator, expected_amount in operator_expected_amount_map.items():
        offline_order_list_real = ShiftCashCollection.objects.filter(date=date, operator_id=operator)
        operator_amount_collected_real = 0
        for offline_order in offline_order_list_real:
            operator_amount_collected_real += offline_order.cash
        diff_for_operator = operator_amount_collected_real - expected_amount

        final_operator_diff_list.append(
            {
                "date": date,
                "operator": operator,
                "diff": diff_for_operator,
                "expected_amount": expected_amount,
                "actual_amount": operator_amount_collected_real,
            }
        )

    return Response(final_operator_diff_list, status=HTTPResponseStatus.HTTP_200_OK)


@api_view(["POST"])
def trigger_call_to_customer(request):
    data = request.data
    customer_phone = data.get("customer_phone")
    text_to_speak = data.get("text_to_speak")
    aadhaar_instance = Aadhaar.objects.filter(phone_number=customer_phone)
    if aadhaar_instance:
        aadhaar_instance = aadhaar_instance[0]
        if len(customer_phone) == 10:
            customer_phone = f"+91{customer_phone}"
        call = twilio_client.calls.create(
            twiml=f'<Response><Say voice="Polly.Raveena">{text_to_speak}</Say></Response>',
            to=customer_phone,
            from_=settings.TWILIO_CALLER_ID,
        )
        return Response({"sid": call.sid}, status=HTTPResponseStatus.HTTP_200_OK)
    else:
        return Response(
            {"msg": "Aadhaar details of given phone number does not exist"},
            status=HTTPResponseStatus.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
def get_mobile_app_fields(request):
    firebase_uid = request.data.get("firebase_uid")
    operator = Operator.objects.filter(firebase_uid=firebase_uid).first()
    service_id_list = Order.objects.filter(status="PENDING", operator_id=operator.id).values_list(
        "service_id",
        flat=True
    )
    print(service_id_list)
    order_latest_instance = Order.objects.filter(status="PENDING", operator_id=operator.id).latest("updated_at")
    aadhaar_instance = Aadhaar.objects.filter(phone_number=order_latest_instance.customer_phone).latest("updated_at")
    payment_link, order_id = create_payment_link(
        order_latest_instance.amount_collected,
        order_latest_instance.customer_phone,
        operator.id,
        service_id_list,
        aadhaar_instance.name,
        None,
    )
    api_response = {
        "payment_link": payment_link,
        "order_id": order_id,
        "operator_id": operator.id,
        "aadhaar_number": aadhaar_instance.aadhaar_number,
        "total_amount": order_latest_instance.amount_collected,
    }
    return Response(api_response, status=HTTPResponseStatus.HTTP_200_OK)
