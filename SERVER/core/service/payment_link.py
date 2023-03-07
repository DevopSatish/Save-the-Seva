from urllib import response
import requests
from django.conf import settings
from django.db import transaction
from uuid import uuid4
from core.enum import ModeOfPayment
from core.models import Order


@transaction.atomic()
def create_payment_link(amount, customer_phone, operator_id, service_id_list, customer_name=None, customer_email=None):
    order_id = str(uuid4())
    for service_id in service_id_list:
        order_instance = Order.objects.create(
            uuid=order_id,
            customer_phone=str(customer_phone),
            operator_id=operator_id,
            service_id=service_id,
            mode_of_payment=ModeOfPayment.ONLINE.value,
            amount_collected=amount,
        )
    request_body = {
        "link_id": order_id,
        "link_amount": amount,
        "link_currency": "INR",
        "link_purpose": "Aadhar services UPI payment",
        "link_notify": {"send_sms": True, "send_email": True},
        "customer_details": {
            "customer_phone": str(customer_phone),
            "customer_email": customer_email,
            "customer_name": customer_name,
        },
        "link_meta": {
            "notify_url": settings.CASHFREE_CALLBACK_URL,
            "upi_intent": True,
            "payment_methods": "upi",
        },
    }
    request_headers = {
        "x-client-id": settings.CASHFREE_CLIENT_ID,
        "x-client-secret": settings.CASHFREE_CLIENT_SECRET,
        "x-api-version": "2022-01-01",
        "Content-Type": "application/json",
    }
    cashfree_api_response = requests.post(
        url="https://sandbox.cashfree.com/pg/links", json=request_body, headers=request_headers
    )
    cashfree_api_response_body = cashfree_api_response.json()
    if cashfree_api_response.status_code == 200:
        return cashfree_api_response_body.get("link_url"), order_id
    else:
        raise Exception(cashfree_api_response_body)
