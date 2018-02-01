#!/bin/bash
export BaseDir=$( cd "$( dirname "${BASH_SOURCE[0]}" )/" && pwd )
export SetupDir="$BaseDir/setup"
export CurrentUser="$USER"

export pgUser="user"
export pgDatabase="dummy"

export debianNewUser="dummy"
export debianNewPassword="dummy"

# install sudo if the distro does not have it by default
apt-get install sudo -y

# create new user if needed
# adduser --disabled-password --gecos "" $debianNewUser
# echo "$debianNewUser:$debianNewPassword" |  /usr/sbin/chpasswd

# add the new user to sudo group
# usermod -aG sudo $debianNewUser

# change your password
# sudo echo "$CurrentUser:$debianNewPassword" | sudo /usr/sbin/chpasswd

#  update and upgrade os
sudo apt-get update -y
sudo apt-get upgrade -y

# set timezone to 'America/New_York' only works for debian
echo 'America/New_York' > sudo /etc/timezone
sudo rm /etc/localtime
sudo cp /usr/share/zoneinfo/US/Eastern /etc/localtime

# download nodejs setup script
pushd ~

# download nodejs with NVM, ref: https://github.com/creationix/nvm
# this method avoid the need of using sudo npm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source ~/.bashrc
nvm install --lts  # install latest nodejs with long-term support
nvm run node --version

# alternative way to download nodejs
# curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
# sudo bash nodesource_setup.sh
# sudo apt-get install nodejs -y
sudo apt-get install build-essential -y

# allow nodejs listen to port 80 and 443
# https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode/
sudo apt-get install -y libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

popd

# install npm dependencies
## sudo npm install -g @angular/cli@1.2.0
npm install -g node-gyp
npm install deasync
npm install

## sudo npm install firebase-admin

# make the nodejs server script executable
chmod +x ./server/index.js

# route 80 to 8080 and 443 to 8443
bash ./setup/iptables.sh

# show open ports
netstat -tln
sudo iptables -S

# install postgreSQL
# bash ./setup/postgresql.sh

# install PM2
sudo npm install -g pm2

# start service
pm2 start ./pm2Start.sh -o ./logs/output.log -e ./logs/error.log
#pm2 start npm -- start -o="./logs/output.log" -e="./logs/error.log"

pm2 startup systemd

#  you need to change this. based on the  result of  pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER

pm2 save


