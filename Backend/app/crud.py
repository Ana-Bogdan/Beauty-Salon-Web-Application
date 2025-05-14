from fastapi import HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, auth


def create_client(db: Session, client: schemas.ClientCreate, user_id: int):
    db_client = models.Client(**client.dict(), created_by=user_id)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def get_clients(db: Session, skip=0, limit=100):
    return db.query(models.Client).offset(skip).limit(limit).all()


def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()


def update_client(db: Session, client_id: int, data: schemas.ClientCreate):
    client = get_client(db, client_id)
    if client:
        for key, value in data.dict().items():
            setattr(client, key, value)
        db.commit()
        db.refresh(client)
    return client


def delete_client(db: Session, client_id: int):
    client = get_client(db, client_id)
    if client:
        db.delete(client)
        db.commit()
    return client


def get_appointments(db: Session, skip=0, limit=100, date_filter=None, sort_by="date", user=None):
    print(f"SKIP: {skip}, LIMIT: {limit}")

    query = db.query(models.Appointment).join(models.Client)

    if user and user.role != "admin":
        query = query.filter(models.Appointment.created_by == user.id)

    if date_filter:
        query = query.filter(models.Appointment.date == date_filter)

    if sort_by == "firstName":
        query = query.order_by(models.Client.firstName)
    elif sort_by == "lastName":
        query = query.order_by(models.Client.lastName)
    elif sort_by in {"date", "service"}:
        query = query.order_by(getattr(models.Appointment, sort_by))

    return query.offset(skip).limit(limit).all()


def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()


def create_appointment(db: Session, appointment: schemas.AppointmentCreate, user_id: int):
    db_appointment = models.Appointment(**appointment.model_dump(), created_by=user_id)
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    log_action(db, user_id, f"Created appointment {db_appointment.id}")
    return db_appointment


def update_appointment(db: Session, appointment_id: int, data: schemas.AppointmentUpdate, user: models.User):
    appt = get_appointment(db, appointment_id)
    if not appt:
        return None

    if user.role != "admin" and appt.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to update this appointment")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(appt, key, value)
    db.commit()
    db.refresh(appt)
    return appt


def delete_appointment(db: Session, appointment_id: int, user: models.User):
    appt = get_appointment(db, appointment_id)
    if not appt:
        return None

    if user.role != "admin" and appt.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this appointment")

    db.delete(appt)
    db.commit()
    return appt


def log_action(db: Session, user_id: int, action: str):
    db_log = models.Log(user_id=user_id, action=action)
    db.add(db_log)
    db.commit()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()
