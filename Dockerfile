# Use the official Node.js image as a base
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Run Prisma generate to generate the client
WORKDIR /app/api
RUN npx prisma generate

# Build the project (run the build command from the root directory)
WORKDIR /app
RUN npm run build

# Expose the port the app will run on
EXPOSE 5000

# Start the application using the "dev" script
CMD ["npm", "run", "dev"]