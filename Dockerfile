# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables if needed
ENV NODE_ENV=development

# Expose the port on which the app runs
EXPOSE 9000

# Command to run the application
CMD ["npm", "run", "dev"]
