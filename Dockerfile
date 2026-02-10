FROM node:22@sha256:379c51ac7bbf9bffe16769cfda3eb027d59d9c66ac314383da3fcf71b46d026c AS build

COPY . /app
WORKDIR /app

RUN corepack enable

RUN pnpm install --frozen-lockfile
RUN BUILD_TYPE=docker pnpm run build
# generate NOTICE file
RUN pnpm run license:extract

RUN pnpm install --prod

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:80dab95b787dc01d567ece51520a5d634cb5f205a278f7a2a2744d253a2cc33b
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
