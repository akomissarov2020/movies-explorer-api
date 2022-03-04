

import os

if __name__ == '__main__':

  os.chdir("/home/akomissarov")

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

  if input("Install mongodb?") or None:
    for command in install_mongodb:
      print(command)
      os.system(command)

  install_git = [
    "sudo apt install -y git",
    "git --version",
  ]

  if input("Install git?") or None:
    for command in install_git:
      print(command)
      os.system(command)

  repository = input("Clone repository?") or None
  if repository:
    folder = repository.split("/")[-1].split(".git")[0]
    command = f"git clone {repository} && cd {folder}"
    print(command)