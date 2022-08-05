import os


def initial_folders():
    if os.path.isdir(os.path.join(os.getcwd(), "static")) == False:
        os.mkdir(os.path.join(os.getcwd(), "static"))

    if os.path.isdir(os.path.join(os.getcwd(), "static", "images")) == False:
        os.mkdir(os.path.join(os.getcwd(), "static", "images"))
