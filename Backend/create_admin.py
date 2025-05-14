import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal
from app.auth import hash_password
from app.models import User

db = SessionLocal()
admin = User(
    email="admin@yahoo.com",
    hashed_password=hash_password("123"),
    role="admin"
)
db.add(admin)
db.commit()
db.close()
print("✅ Admin created!")
