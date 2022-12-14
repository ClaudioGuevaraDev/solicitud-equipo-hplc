import re

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'


def check_email(email: str):
    if (re.fullmatch(regex, email)):
        return True

    return False
