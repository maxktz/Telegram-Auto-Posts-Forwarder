# Base image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY bun.lockb package.json ./

# Install dependencies
RUN bun install

# Copy all files
COPY . .

# Expose the app port (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
