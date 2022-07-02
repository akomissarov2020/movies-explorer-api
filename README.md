# movies-explorer-api

# Backend для приложения сохранения фильмов.

Приложение доступно по адресам:

- http://api.smotrelka.nomoredomains.work
- https://api.smotrelka.nomoredomains.work

Установка приложения:

```bash
git clone https://github.com/akomissarov2020/movies-explorer-api.git
git checkout level-1
cd movies-explorer-api
npm install
```

Для запуска в режиме разработки:

```bash
npm run dev
```

Для запуска в режиме продакшена:

```bash
npm run start
```

Для запуска автоматических тестов на chai/motcha:

```bash
npm run test
```

Для проверки линтером и исправление ошибок:

```bash
npm run polish
```

Для установки на сервер с нуля:

Нужно правильно прописать настройки в файле settings.py:

```python
folder = "movies-explorer-api"
user = "akomissarov"
branch = "level-1"
IP_address = "51.250.30.152"

nginx_config_settings = {
  "root_folder": "/home/akomissarov/movies-explorer-frontend/build/",
  "front_address": "smotrelka.nomoredomains.work",
  "back_address": "api.smotrelka.nomoredomains.work",
}
```

И после этого запустить:

```bash
sudo python3 deploy/deploy.py
```
