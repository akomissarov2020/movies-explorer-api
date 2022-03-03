

import os

if __name__ == '__main__':

    folders = {
        "utils": "utils",
        "routes": "routes",
        "models": "models",
        "middlewares": "middlewares",
        "logs": "logs",
        "errors": "errors",
        "controllers": "controllers",
    }

    files = {
        "app.js": "app.js",
        "middlewares_auth": "middlewares/auth.js",
        "middlewares_loggers": "middlewares/loggers.js",
    }

    models = ["user", "movie"]

    for folder in folders.values():
        if not os.path.isdir(folder):
            os.makedirs(folder)

    for file_name in files.values():
        if not os.path.isfile(file_name):
            with open(file_name, "w") as fh:
                pass

    for model in models:
        for folder in ["routes", "models", "controllers"]:
            file_name = os.path.join(folder, model + ".js")
            if not os.path.isfile(file_name):
                with open(file_name, "w") as fh:
                    pass

