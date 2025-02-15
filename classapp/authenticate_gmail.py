from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
import pickle
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.text import MIMEText
import base64

print("Starting authentication process...")

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

CREDENTIALS_PATH = "/home/fkosiu79/skapp/credentials.json"

def get_credentials():
    creds = None
    if os.path.exists("token.pickle"):
        with open("/home/fkosiu79/skapp/token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)

        with open("/home/fkosiu79/skapp/token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return creds

#get_credentials()

def send_email():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    message = MIMEText("このメールはテスト送信です。")
    message['to'] = "e2259245@soka-u.jp"  # 実際の送信先メールアドレスに変更
    message['subject'] = "テストメール"
    message['from'] = "rcpgm3rqa7@gmail.com"

    raw_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
    
    try:
        message = service.users().messages().send(userId="me", body=raw_message).execute()
        print(f"メール送信成功: {message['id']}")
    except HttpError as error:
        print(f"メール送信エラー: {error}")

send_email()