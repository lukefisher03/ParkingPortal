import smtplib, ssl, json
from email.mime.text import MIMEText
from custom_types import NotificationEmail

SMTP_SERVER = "smtp-mail.outlook.com"
SMTP_PORT = 587

def authenticate_smtp():
    """
    Return an authenticated SMTP object to send mail from
    """
    creds = {}
    try:
        with open("credentials.json", "r") as f:
            creds = json.load(f)
    except FileNotFoundError:
        print("Credentials file for email client does not exist")

    if not creds.get("email") or not creds.get("password"):
        print("There is no credentials provided for the email client, email functionality will not work")
        return None
    email, password = creds.get("email"), creds.get("password")
    context = ssl.create_default_context()
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    print(server.login(email, password))
    return server

def send_notification_emails(vehicles_to_notify, to):
    """
    msg: [body str, subject]
    to: str
    """
    try:
        with authenticate_smtp() as server:
            for vehicle in vehicles_to_notify:
                email_body = NotificationEmail(vehicle)
                mime_text = MIMEText(email_body.build_email())
                mime_text["Subject"] = f"CITATION ALERT for {vehicle.get("plate")}"
                mime_text["From"] = server.user

                errors = server.sendmail(server.user, to, mime_text.as_string())
                if errors:
                    print(f"There were errors sending your email, {errors}")
                else:
                    print("Email was sent!!")
    except TypeError as e:
        print("UI tried to trigger an email sending, there's no credentials provided for the SMTP connection. Please see readme for setting up email integration.")

if __name__ == "__main__":
    mail_server = authenticate_smtp()