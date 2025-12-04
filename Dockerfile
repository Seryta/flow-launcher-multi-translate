# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /build

# Copy package files
COPY package.json ./

# Install dependencies using npm (matching CI)
RUN npm install

# Copy source files and configuration
COPY . .

# Build the plugin
RUN npm run build

# Remove all node_modules and install production dependencies only (matching CI)
RUN rm -rf node_modules && \
    npm ci --only=production

# Create plugin zip (matching CI: zip everything except git files)
RUN apk add --no-cache zip && \
    mkdir -p /output && \
    zip -r /output/flow-launcher-multi-translate.zip . -x '*.git*' '.dockerignore' 'Dockerfile' 'build-plugin.sh'

# Output the zip file
CMD ["cp", "/output/flow-launcher-multi-translate.zip", "/workspace/flow-launcher-multi-translate.zip"]
