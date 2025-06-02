from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # roles: 'user', 'admin'

    logs = relationship("Log", back_populates="user")
    clients_created = relationship("Client", back_populates="creator")
    appointments_created = relationship("Appointment", back_populates="creator")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String, index=True)
    lastName = Column(String, index=True)
    phoneNumber = Column(String)

    created_by = Column(Integer, ForeignKey("users.id"))

    creator = relationship("User", back_populates="clients_created")

    appointments = relationship("Appointment", back_populates="client")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey('clients.id'))
    date = Column(Date)
    time = Column(Time)
    service = Column(String)

    created_by = Column(Integer, ForeignKey("users.id"))
    client = relationship("Client", back_populates="appointments")
    creator = relationship("User", back_populates="appointments_created")


class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="logs")
