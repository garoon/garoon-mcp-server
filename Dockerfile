FROM node:22@sha256:3266bc9e8bee1acc8a77386eefaf574987d2729b8c5ec35b0dbd6ddbc40b0ce2 AS build

COPY . /app
WORKDIR /app

RUN corepack enable

RUN pnpm install --frozen-lockfile
RUN BUILD_TYPE=docker pnpm run build
# generate NOTICE file
RUN pnpm run license:extract

RUN pnpm install --prod

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:e5403162edcafbf01af6411d6a94858dfde55de6f3e9c821b1c490379c4bbac2
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
