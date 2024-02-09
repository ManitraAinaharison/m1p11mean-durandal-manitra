# current node version at that time (12/2023)
# apline bc it's the lightest
FROM node:21-alpine
WORKDIR /app

# Copy the current dir contents into the container at /client
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 5000

# Run the app when the container launches
#CMD ["npm", "start"]