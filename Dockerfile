FROM node:22@sha256:bb6834c0669aa71cbc8d94606561a721adf489f6b93d7b8b825f0cf1b498c2c4 AS build

COPY . /app
WORKDIR /app

RUN npm install --frozen-lockfile
RUN npm run build
# generate NOTICE file
RUN npm run license:extract

RUN npm install --only=production

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:ce215c7aca8708c4a748b351272d2722289f940d7626e86ad6da877008fd03d6
LABEL org.opencontainers.image.source=https://github.com/garoon/garoon-mcp-server

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/LICENSE ./LICENSE
COPY --from=build /app/NOTICE ./NOTICE

# ref. https://github.com/GoogleContainerTools/distroless/tree/main/nodejs#usage
# > The entrypoint of this image is set to "node", so this image expects users to supply a path to a .js file in the CMD.
CMD ["dist/index.js"]
