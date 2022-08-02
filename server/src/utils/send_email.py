import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config.config import sender_address, sender_password


def send_email(receiver_address: str, user_id: str):
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = 'Verificación de cuenta.'

    mail_content = f'''
        <a href="http://localhost:8000/api/auth/account-verification/{user_id}">Presiona aquí para validar tu cuenta!</a>
    '''

    message.attach(MIMEText(mail_content, 'html'))
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(sender_address, sender_password)
    text = message.as_string()
    session.sendmail(sender_address, receiver_address, text)
    session.quit()
