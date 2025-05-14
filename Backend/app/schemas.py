from pydantic import BaseModel, Field, constr
from datetime import date, time
from pydantic.v1 import validator
from pydantic import EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


class ClientBase(BaseModel):
    firstName: constr(min_length=1, max_length=50)
    lastName: constr(min_length=1, max_length=50)
    phoneNumber: constr(pattern=r'^[0-9]+$')


class ClientCreate(ClientBase):
    pass


class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True


class AppointmentBase(BaseModel):
    date: date
    time: time
    service: str

    @validator("date")
    def validate_future_date(cls, v):
        print(f"Validating date: {v}")
        if v < date.today():
            raise ValueError("Appointment date must be today or in the future.")
        return v


class AppointmentCreate(BaseModel):
    client_id: int
    date: date
    time: time
    service: str


class AppointmentUpdate(AppointmentBase):
    date: date
    time: time
    service: str


class Appointment(AppointmentBase):
    id: int
    client: Client

    model_config = {
        "from_attributes": True
    }
