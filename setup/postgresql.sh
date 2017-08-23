#!/bin/bash

# http://trac.osgeo.org/postgis/wiki/UsersWikiPostGIS23UbuntuPGSQL96Apt

# install postgresql 9.6
sudo apt-get install postgresql-9.6 -y
# sudo apt-get install postgresql-9.6-postgis-2.3 postgresql-contrib-9.6 -y

# to get the commandline tools shp2pgsql, raster2pgsql you need to do this
# sudo apt-get install postgis -y

# Install pgRouting 2.3 package
# sudo apt-get install postgresql-9.6-pgrouting -y

# Command to start PostgreSQL server
sudo systemctl start postgresql

# Command to stop PostgreSQL server
# sudo systemctl stop postgresql

# configure setting
sudo cp /etc/postgresql/9.6/main/pg_hba.conf /etc/postgresql/9.6/main/pg_hba.conf.backup
sudo cp $SetupDir/setting/pg_hba.conf /etc/postgresql/9.6/main/pg_hba.conf

# Command to restart PostgreSQL server
 sudo systemctl restart postgresql

# sleep 5 secord for starting postgresql
sleep 5

# Command to see status of PostgreSQL server
sudo systemctl status postgresql

# change postgres password
# sudo echo "postgres:postgresAdminPassword" | sudo /usr/sbin/chpasswd

echo "Postgresql is adding db & user"

#Create Dummy Database
createdb -U postgres $pgDatabase
# psql -U postgres -d $pgDatabase -c 'CREATE EXTENSION  postgis'
#psql -U postgres -d $pgDatabasey -c 'CREATE EXTENSION pgcrypto'

##Create user in postgres
createuser -U postgres -I -D -R --no-replication $pgUser
psql -U postgres -d $pgDatabase -c "GRANT CREATE ON DATABASE \"$pgDatabase\" TO \"$pgUser\";"

echo "created db user: $pgUser"
echo "created database: $pgDatabase"

# dummy snippet
psql -U $pgUser -d  $pgDatabase -c "SELECT CURRENT_DATE;"
psql -U $pgUser -d  $pgDatabase -f $SetupDir/setting/pg_dummy.sql
psql -U $pgUser -d  $pgDatabase -c "COPY dummy.foo FROM stdin DELIMITER ',' CSV HEADER;" < $SetupDir/setting/pg_dummy.csv

echo "postgresql.sh completed!"
