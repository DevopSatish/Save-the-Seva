from twilio.rest import Client
from django.conf import settings

sms_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def trigger_twilio_sms(to_number: str, body: str) -> str:
    message = sms_client.messages.create(
        messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_ID, to=str(to_number), body=str(body)
    )
    return str(message.sid)
