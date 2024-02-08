# current node version at that time (12/2023)
FROM mongodb/mongodb-community-server:6.0.13-ubuntu2204

WORKDIR /app

# Copy the current dir contents into the container at /client
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 27017

# Run the db
CMD ["mongo"]