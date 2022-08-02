from passlib.hash import bcrypt


def encrypt_password(password):
    return bcrypt.hash(password)


def compare_password(password, hashed_password):
    return bcrypt.verify(password, hashed_password)
