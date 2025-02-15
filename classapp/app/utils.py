from itsdangerous import URLSafeTimedSerializer
from django.conf import settings
#from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
import pickle
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
CREDENTIALS_PATH = os.getenv("GMAIL_CREDENTIALS_PATH", "credentials.json")
TOKEN_PATH = os.getenv("GMAIL_TOKEN_PATH", "token.pickle")

def get_credentials():
    # Gmail APIの認証情報を取得する
    creds = None
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_PATH, "wb") as token:
            pickle.dump(creds, token)

    return creds


def send_gmail(to_email, subject, message_body):
    # Gmail APIを使ってメールを送信
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    message = MIMEText(message_body)
    message['to'] = to_email
    message['subject'] = subject
    message['from'] = settings.DEFAULT_FROM_EMAIL

    raw_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
    
    try:
        message = service.users().messages().send(userId="me", body=raw_message).execute()
        print(f"✅ メール送信成功: {to_email}")
    except Exception as error:
        print(f"⚠️ メール送信エラー: {error}")


def generate_email_verification_token(email):
    # メールアドレス確認用のトークンを生成
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    return serializer.dumps(email, salt="email-confirmation")

def verify_email_verification_token(token):
    # メールアドレス確認用のトークンを検証
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        email = serializer.loads(token, salt="email-confirmation", max_age=3600)  # 1時間有効
        return email
    except:
        return None

def send_verification_email(user, request):
    # 認証メールをGmail APIを使って送信
    token = generate_email_verification_token(user.email)
    current_site = get_current_site(request).domain
    verification_link = f"http://{current_site}/verify-email/{token}/"

    subject = "メールアドレスの確認"
    message = f"以下のリンクをクリックしてアカウントを有効化してください:\n\n{verification_link}"
    
    send_gmail(user.email, subject, message)