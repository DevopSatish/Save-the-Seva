from rest_framework import serializers

from core.models import *


class CentreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centre
        fields = "__all__"


class OperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class ShiftCashCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftCashCollection
        fields = "__all__"


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class AadhaarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aadhaar
        fields = "__all__"


class AadhaarLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AadhaarLog
        fields = "__all__"
