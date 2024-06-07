FROM node:16-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./ 

RUN npm ci

COPY . .

EXPOSE 8081

CMD ["node", "mywebassets.js"]

# docker build . --file Dockerfile -t mywebassets
# docker run -p 8081:8081 -v ~/uploads:/app/uploads/ mywebassets
# http://localhost:8081