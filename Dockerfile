FROM node:22@sha256:3266bc9e8bee1acc8a77386eefaf574987d2729b8c5ec35b0dbd6ddbc40b0ce2 AS build

COPY . /app
WORKDIR /app

RUN npm install --frozen-lockfile
RUN BUILD_TYPE=docker npm run build
# generate NOTICE file
RUN npm run license:extract

RUN npm install --only=production

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:3c90d20cfa08093504ee4795fae9e2571b605dd975b3992e1ef8ccf8b146388a
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
