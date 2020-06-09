#! /bin/bash

######################################################################
#
# This script generates random JWT secret file.
#
######################################################################

openssl rand -base64 1024 | tr -d '\n' > ../config/ssl/jwt.secret
