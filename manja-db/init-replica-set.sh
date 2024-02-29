#!/bin/bash

# Initialize the replica set
echo "rs.initiate()" | mongosh -u myadmin -p mypassword

# Create an administrator user
echo 'db.createUser({ user: "myadmin", pwd: "mypassword", roles: [{ role: "root", db: "admin" }] })' | mongosh admin

# Add other commands as needed
mongosh