from enum import Enum


class BaseEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class ModeOfPayment(BaseEnum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"


class UserRole(BaseEnum):
    OPERATOR = "OPERATOR"
    ADMIN = "ADMIN"


class OrderStatus(BaseEnum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
