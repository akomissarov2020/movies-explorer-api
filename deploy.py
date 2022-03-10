import os

nginx_config_template = '''server {
        listen 80;

        server_name %(back_address)s;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_no_cache $http_pragma $http_authorization;
        }
}
server {
      listen 80;

      server_name %(front_address)s;

      root %(root_folder)s;

      location * {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_no_cache $http_pragma $http_authorization;
      }

      location / {
               try_files $uri $uri/ /index.html;
       }
}'''


if __name__ == '__main__':


  folder = "movies-explorer-api"
  user = "akomissarov"
  branch = "level-1"
  nginx_config = "movies-explorer-api.conf"
  IP = "51.250.30.152"

  os.chdir("/home/%s" % user)

  nginx_config_settings = {
    "root_folder": "/home/akomissarov/express-mesto/frontend/build/",
    "front_address": "smotrelka.nomoredomains.work",
    "back_address": "api.smotrelka.nomoredomains.work",
  }

  nginx_config_path = "/etc/nginx/sites-available/default"
  nginx_config_config_text = nginx_config_template % nginx_config_settings

  install_nodejs = [
    "curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -",
    "sudo apt install -y nodejs",
    "node -v",
  ]

  if input("Install nodejs?") or None:
    for command in install_nodejs:
      print(command)
      os.system(command)

  install_mongodb = [
    "curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -",
    'echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list',
    "sudo apt update",
    "sudo apt install -y mongodb-org",
    "sudo service mongod start",
    "sudo systemctl enable mongod.service",
    "mongo --version",
  ]

  install_git = [
    "sudo apt install -y git",
    "git --version",
  ]

  install_app = [
    "npm install",
    "sudo npm install pm2 -g",
    "pm2 startup",
    "pm2 start app.js",
    f"sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u {user} --hp /home/{user}",
    "pm2 save",
  ]

  install_nginx = [
    "sudo apt update",
    "sudo apt install -y nginx",
    "sudo ufw allow 'Nginx Full'",
    "sudo ufw allow OpenSSH",
    "sudo ufw enable",
    "sudo systemctl enable --now nginx",
    # f"sudo ln -s /etc/nginx/sites-available/{nginx_config} /etc/nginx/sites-enabled/{nginx_config}",
  ]

  install_nginx_part2 = [
    "sudo nginx -t",
    "sudo systemctl reload nginx",
  ]

  install_nginx_https = [
    "sudo apt update",
    "sudo apt install -y certbot python3-certbot-nginx",
    "sudo certbot --nginx",
    "sudo systemctl reload nginx",
  ]

  reissue_https_cert = [
    'sudo certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start"',
  ]

  if input("Install mongodb?") or None:
    for command in install_mongodb:
      print(command)
      os.system(command)



  if input("Install git?") or None:
    for command in install_git:
      print(command)
      os.system(command)

  repository = input("Clone repository?") or None
  if repository:
    folder = repository.split("/")[-1].split(".git")[0]
    command = f"git clone {repository} && cd {folder} &&  git checkout {branch}"
    print(command)
    os.system(command)

  os.chdir(f"/home/akomissarov/{folder}")

  if input("Install app?") or None:
    for command in install_app:
      print(command)
      os.system(command)

  if input("Install and config nginx?") or None:
    for command in install_nginx:
      print(command)
      os.system(command)
    with open(nginx_config_path, "w") as fw:
      fw.write(nginx_config_config_text)
    for command in install_nginx_part2:
      print(command)
      os.system(command)

  if input("Install certificates?") or None:
    for command in install_nginx_https:
      print(command)
      os.system(command)

  if input("Update certificates?") or None:
    for command in reissue_https_cert:
      print(command)
      os.system(command)







