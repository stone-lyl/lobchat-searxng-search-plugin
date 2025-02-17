 # Use official Bun image
 FROM oven/bun:slim as base

 # Set production environment
 ENV NODE_ENV=production

 # Install dependencies
 WORKDIR /app
 COPY package.json .
 RUN bun install --production

 # Copy source files
 COPY src src
 COPY public public
 COPY tsconfig.json .

 # Set the working directory and expose port
 WORKDIR /app
 EXPOSE 3400

 # Run the application
 CMD ["bun", "run", "src/index.ts"]