from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Staff

app = FastAPI()


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    staff = db.query(Staff).all()

    return {
        "message": "Database connected successfully!",
        "staff_count": len(staff)
    }