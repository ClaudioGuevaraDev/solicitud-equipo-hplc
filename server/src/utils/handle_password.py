import bcrypt


def encrypt_password(password):
    password = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    return hashed_password


def compare_password(password, hashed_password):
    password = password.encode("utf-8")

    if bcrypt.checkpw(password, hashed_password):
        return True

    return False
