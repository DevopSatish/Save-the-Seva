from django.urls import path
from rest_framework.routers import DefaultRouter

from core.viewsets import *
from .views import *

router = DefaultRouter()
router.register(r"centre", CentreViewSet, basename="centre")
router.register(r"operator", OperatorViewSet, basename="operator")
router.register(r"service", ServiceViewSet, basename="service")
router.register(r"order", OrderViewSet, basename="order")
router.register(r"shift_cash_collection", ShiftCashCollectionViewSet, basename="shift_cash_collection")
router.register(r"feedback", FeedbackViewSet, basename="feedback")
router.register(r"aadhaar", AadhaarViewSet, basename="aadhaar")
router.register(r"aadhaar_log", AadhaarLogViewSet, basename="aadhaar_log")


urlpatterns = [
    path("health", health_check, name="health_check"),
    path("send_sms", send_sms, name="send_sms"),
    path("get_payment_link", get_payment_link, name="get_payment_link"),
    path("pg_success_callback", pg_success_callback, name="pg_success_callback"),
    path("create_user", create_user, name="create_user"),
    path("recon_diff", recon_diff, name="recon_diff"),
    path("trigger_call", trigger_call_to_customer, name="trigger_call_to_customer"),
    path("get_mobile_app_fields", get_mobile_app_fields, name="get_mobile_app_fields"),
] + router.urls
