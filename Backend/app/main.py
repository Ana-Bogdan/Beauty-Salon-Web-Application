from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud, dependencies, auth
from .database import SessionLocal, engine, Base
from typing import Optional
from datetime import date
from .auth import get_current_user
from .models import User
from .auth import SECRET_KEY
print("MAIN SECRET_KEY:", SECRET_KEY)  # Debug line

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/clients/", response_model=schemas.Client)
def create_client(
    client: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_client(db, client, user_id=current_user.id)



@app.get("/clients/", response_model=list[schemas.Client])
def read_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return crud.get_clients(db, skip, limit)
    else:
        return db.query(models.Client).filter(models.Client.created_by == current_user.id).offset(skip).limit(limit).all()


@app.get("/clients/{client_id}", response_model=schemas.Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.get_client(db, client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@app.patch("/clients/{client_id}", response_model=schemas.Client)
def update_client(client_id: int, data: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = crud.update_client(db, client_id, data)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    if crud.delete_client(db, client_id) is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Deleted successfully"}


@app.post("/appointments/", response_model=schemas.Appointment)
def create_appointment(
    appt: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("Received appointment:", appt)
    print("User:", current_user.email)
    return crud.create_appointment(db, appt, user_id=current_user.id)


@app.get("/appointments/", response_model=list[schemas.Appointment])
def read_appointments(
    skip: int = 0,
    limit: int = 100,
    date_filter: Optional[date] = None,
    sort_by: Optional[str] = "date",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ✅ get current user
):
    print("✅ /appointments/ accessed by:", current_user.email, "| role:", current_user.role)
    return crud.get_appointments(db, skip=skip, limit=limit, date_filter=date_filter, sort_by=sort_by, user=current_user)


@app.get("/appointments/{appointment_id}", response_model=schemas.Appointment)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appt = crud.get_appointment(db, appointment_id)
    if db_appt is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appt


@app.patch("/appointments/{appointment_id}", response_model=schemas.Appointment)
def update_appointment(
    appointment_id: int,
    data: schemas.AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.update_appointment(db, appointment_id, data, user=current_user)


@app.delete("/appointments/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.delete_appointment(db, appointment_id, user=current_user)


@app.get("/health-check")
def health_check():
    return {"status": "ok"}


@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(auth.get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)


@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(auth.get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = auth.create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}


# @app.get("/users/", response_model=list[schemas.UserOut])
# def get_all_users(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(dependencies.require_admin)
# ):
#     return db.query(User).all()
#
#
# @app.post("/users/{user_id}/promote")
# def promote_user(
#     user_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(dependencies.require_admin)
# ):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     user.role = "admin"
#     db.commit()
#     return {"message": f"{user.email} promoted to admin"}
