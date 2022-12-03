# ==============================================================================
# BUILD STAGE
# ==============================================================================
# Build our project with production configuration. The result of this stage is a
# "dist" directory, which is then copied to a production stage and served using
# nginx.
FROM node:lts-alpine AS build

WORKDIR /app

# Copy "package.json" and "package-lock.json" (if available) to working
# directory and install project requirements.
COPY package*.json ./
RUN npm install

# Copy all project files to current working directory and build the project
# using npm build system. We could also build it using the "yarn build" command,
# but this is not needed, since the build command is already present in the
# "package.json" file.
COPY . .
RUN npm run build

# ==============================================================================
# PRODUCTION STAGE
# ==============================================================================
# Copy the "dist" directory from the build stage into a new nginx container and
# serve the files on port 80.
FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]