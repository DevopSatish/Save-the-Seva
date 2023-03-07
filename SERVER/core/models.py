from uuid import uuid4
from django.db import models

from core.enum import *


# Create your models here.


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Centre(TimeStampedModel):
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=256, null=True, blank=False, default=None)
    latitude = models.FloatField(null=True, blank=False)
    longitude = models.FloatField(null=True, blank=False)

    def __str__(self) -> str:
        return str(self.id) + ": " + self.name


class Operator(TimeStampedModel):
    name = models.CharField(max_length=256, null=False, blank=False)
    booth = models.PositiveSmallIntegerField(null=False, blank=False)
    active_centre = models.ForeignKey(Centre, on_delete=models.CASCADE, null=False, blank=False)
    role = models.CharField(
        max_length=8, choices=UserRole.choices(), null=False, blank=False, default=UserRole.OPERATOR.value
    )
    firebase_uid = models.CharField(max_length=128, null=False, blank=False, unique=True)

    def __str__(self) -> str:
        return str(self.id) + ": " + self.name


class Service(TimeStampedModel):
    name = models.CharField(max_length=256, null=False, blank=False)
    cost = models.FloatField(default=0, null=False, blank=False)

    def __str__(self) -> str:
        return str(self.id) + ": " + self.name


class Order(TimeStampedModel):
    uuid = models.UUIDField(default=uuid4, editable=False, null=False, blank=False)
    pg_txn_id = models.CharField(max_length=256, null=True, blank=False, default=None)
    customer_phone = models.CharField(max_length=10, null=False, blank=False)
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, null=False, blank=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, null=False, blank=False)
    mode_of_payment = models.CharField(max_length=8, choices=ModeOfPayment.choices(), null=False, blank=False)
    status = models.CharField(
        max_length=16, choices=OrderStatus.choices(), null=False, blank=False, default=OrderStatus.PENDING.value
    )
    amount_collected = models.FloatField(null=False, blank=False)

    def __str__(self) -> str:
        return str(self.id) + ": " + str(self.uuid)

    class Meta:
        unique_together = ["uuid", "pg_txn_id", "customer_phone", "operator", "service", "created_at", "updated_at"]


class ShiftCashCollection(TimeStampedModel):
    date = models.DateField(blank=False, null=False)
    cash = models.BigIntegerField(blank=False, null=False)
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self) -> str:
        return str(self.id) + ": " + str(self.date) + " " + str(self.cash) + " " + str(self.operator)

    class Meta:
        unique_together = ["date", "operator"]


class Feedback(TimeStampedModel):
    order_uuid = models.CharField(max_length=128, null=False, blank=False, unique=True)
    user_paid_amount = models.PositiveBigIntegerField(null=False, blank=False)
    stars = models.IntegerField(null=False, blank=False)

    def __str__(self) -> str:
        return str(self.order_uuid) + ": " + str(self.user_paid_amount) + " " + str(self.stars)


class Aadhaar(TimeStampedModel):
    aadhaar_number = models.PositiveBigIntegerField(null=False, blank=False)
    name = models.CharField(max_length=128, null=False, blank=False)
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    address = models.CharField(max_length=250, null=False, blank=False)
    requested_changes = models.JSONField()

    def __str__(self) -> str:
        return str(self.aadhaar_number) + ": " + str(self.name) + " " + str(self.phone_number)

    def save(self):
        AadhaarLog.objects.create(
            aadhaar_number=self.aadhaar_number,
            name=self.name,
            address=self.address,
            requested_changes=self.requested_changes,
            phone_number=self.phone_number
        )
        return super().save()

    class Meta:
        unique_together = ["aadhaar_number", "phone_number"]


class AadhaarLog(TimeStampedModel):
    aadhaar_number = models.PositiveBigIntegerField(null=False, blank=False)
    name = models.CharField(max_length=128, null=False, blank=False)
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    address = models.CharField(max_length=250, null=False, blank=False)
    requested_changes = models.JSONField()

    def __str__(self) -> str:
        return str(self.aadhaar_number) + ": " + str(self.name) + " " + str(self.phone_number)
