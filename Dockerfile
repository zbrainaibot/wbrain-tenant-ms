# ---- Dependencies ---- 
FROM node:18-alpine AS dependencies 

# Create app directory 
RUN mkdir -p /app 

# Create working directory 
WORKDIR /app 

# A wildcard is used to ensure both package.json AND package-lock.json are copied 
COPY package*.json ./ 

# install app dependencies including 'devDependencies' 
RUN npm install 

# --- Release with Alpine ---- 
FROM node:18-alpine AS Dev 

# Create app directory 
RUN mkdir -p /usr/src/app 

# Create working directory 
WORKDIR /usr/src/app 

COPY --from=dependencies /app/node_modules ./node_modules 

COPY . /usr/src/app 

# Expose fix port 
EXPOSE 3001 
CMD [ "npm", "start" ]