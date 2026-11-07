import os
import smtplib
from email.message import EmailMessage
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()

def send_reset_email(email: str, token: str):
    reset_link = (
        "http://localhost:5173/reset-password?"
        + urlencode({"token": token})
    )

    message = EmailMessage()
    message["Subject"] = "Reset Your InterviewAI Password"
    message["From"] = "no-reply@interviewai.test"
    message["To"] = email

    message.set_content(f"""
    Hello,

    Click the link below to reset your password:

    {reset_link}

    This link expires in 5 minutes.

    If you didn't request this, ignore this email.

    InterviewAI Team
    """)

    with smtplib.SMTP(
        os.environ["SMTP_HOST"],
        int(os.environ["SMTP_PORT"]),
        timeout=15
    ) as server:
        server.starttls()
        server.login(
            os.environ["SMTP_USER"],
            os.environ["SMTP_PASSWORD"]


        )
        server.send_message(message)