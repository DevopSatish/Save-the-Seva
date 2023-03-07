from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import response, viewsets, status

from .serializer import *


class CentreViewSet(viewsets.ModelViewSet):
    serializer_class = CentreSerializer
    queryset = Centre.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"


class OperatorViewSet(viewsets.ModelViewSet):
    serializer_class = OperatorSerializer
    queryset = Operator.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"


class ShiftCashCollectionViewSet(viewsets.ModelViewSet):
    serializer_class = ShiftCashCollectionSerializer
    queryset = ShiftCashCollection.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"

    def create(self, request, *args, **kwargs):
        date = request.data.get("date")
        cash = request.data.get("cash")
        operator_id = request.data.get("operator")
        ShiftCashCollection.objects.update_or_create(date=date, operator_id=operator_id, defaults={"cash": cash})
        return response.Response("Updated", status=status.HTTP_200_OK)


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = "__all__"


class AadhaarViewSet(viewsets.ModelViewSet):
    serializer_class = AadhaarSerializer
    queryset = Aadhaar.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["aadhaar_number", "name", "phone_number"]


class AadhaarLogViewSet(viewsets.ModelViewSet):
    serializer_class = AadhaarLogSerializer
    queryset = AadhaarLog.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["aadhaar_number", "name", "phone_number"]
