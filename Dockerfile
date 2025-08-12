FROM node:22@sha256:4a8a86785c23bd679b29e1b038f18605f46f7f6ab269016b27bdf1391d9f269d

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/

RUN npm run build

RUN rm -rf src/ node_modules/ && npm ci --only=production

ENTRYPOINT ["npm", "run", "start", "--silent"]
