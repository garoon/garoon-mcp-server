FROM node:22@sha256:379c51ac7bbf9bffe16769cfda3eb027d59d9c66ac314383da3fcf71b46d026c AS build

# CI sets this to true so a missing npm_auth secret fails the build instead of
# silently installing from the public registry. scripts/build-docker.sh leaves
# it false so local builds keep working without a secret.
ARG REQUIRE_NPM_AUTH=false

COPY . /app
WORKDIR /app

RUN corepack enable

# Install through the Takumi Guard registry. ~/.npmrc is written and removed
# inside this single RUN so no credential lands in an image layer.
RUN --mount=type=secret,id=npm_auth \
    REGISTRY_HOST="npm.flatt.tech" && \
    NPM_AUTH=$(cat /run/secrets/npm_auth 2>/dev/null || true) && \
    if [ -z "$NPM_AUTH" ] && [ "$REQUIRE_NPM_AUTH" = "true" ]; then \
        echo "npm_auth secret is required but missing" >&2 && exit 1; \
    fi && \
    if [ -n "$NPM_AUTH" ]; then \
        echo "registry=https://${REGISTRY_HOST}/" > ~/.npmrc && \
        echo "//${REGISTRY_HOST}/:_authToken=${NPM_AUTH}" >> ~/.npmrc; \
    fi && \
    pnpm install --frozen-lockfile && \
    rm -f ~/.npmrc

RUN BUILD_TYPE=docker pnpm run build
# generate NOTICE file
RUN pnpm run license:extract

RUN --mount=type=secret,id=npm_auth \
    REGISTRY_HOST="npm.flatt.tech" && \
    NPM_AUTH=$(cat /run/secrets/npm_auth 2>/dev/null || true) && \
    if [ -z "$NPM_AUTH" ] && [ "$REQUIRE_NPM_AUTH" = "true" ]; then \
        echo "npm_auth secret is required but missing" >&2 && exit 1; \
    fi && \
    if [ -n "$NPM_AUTH" ]; then \
        echo "registry=https://${REGISTRY_HOST}/" > ~/.npmrc && \
        echo "//${REGISTRY_HOST}/:_authToken=${NPM_AUTH}" >> ~/.npmrc; \
    fi && \
    pnpm install --prod && \
    rm -f ~/.npmrc

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:13593b7570658e8477de39e2f4a1dd25db2f836d68a0ba771251572d23bb4f8e
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
