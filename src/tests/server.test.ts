import { describe, it, expect, afterEach } from "vitest";
import {
  Client,
  InMemoryTransport,
  type JSONRPCMessage,
  type VersionNegotiationMode,
} from "@modelcontextprotocol/client";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "../server.js";

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) {
    await cleanup();
  }
});

function serve() {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const errors: Error[] = [];
  const handle = serveStdio(createServer, {
    transport: serverTransport,
    onerror: (error) => errors.push(error),
  });
  cleanups.push(() => handle.close());
  return { clientTransport, errors };
}

async function connect(mode: VersionNegotiationMode) {
  const { clientTransport, errors } = serve();
  const client = new Client(
    { name: "test-client", version: "0.0.0" },
    { versionNegotiation: { mode } },
  );
  await client.connect(clientTransport);
  cleanups.push(() => client.close());
  return { client, errors };
}

function createRequester(transport: InMemoryTransport) {
  const pending = new Map<number, (message: JSONRPCMessage) => void>();
  let nextId = 1;
  transport.onmessage = (message) => {
    if ("id" in message && typeof message.id === "number") {
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    }
  };
  return {
    request: async (method: string, params: Record<string, unknown>) => {
      const id = nextId++;
      const response = new Promise<JSONRPCMessage>((resolve) => {
        pending.set(id, resolve);
      });
      await transport.send({ jsonrpc: "2.0", id, method, params });
      const message = await response;
      if (!("result" in message)) {
        throw new Error(`Request ${method} failed: ${JSON.stringify(message)}`);
      }
      return message.result as Record<string, unknown>;
    },
    notify: (method: string) => transport.send({ jsonrpc: "2.0", method }),
  };
}

async function expectCurrentTimeToolWorks(client: Client) {
  const { tools } = await client.listTools();
  expect(tools.map((tool) => tool.name)).toContain("garoon-get-current-time");
  const result = await client.callTool({
    name: "garoon-get-current-time",
    arguments: { timezone: "Asia/Tokyo" },
  });
  expect(result.isError).toBeFalsy();
  expect(
    (result.structuredContent as { result?: unknown } | undefined)?.result,
  ).toBeDefined();
}

describe("stdio entry point served through serveStdio", () => {
  it("negotiates the modern protocol when pinned to 2026-07-28", async () => {
    const { client, errors } = await connect({ pin: "2026-07-28" });
    expect(client.getProtocolEra()).toBe("modern");
    expect(client.getNegotiatedProtocolVersion()).toBe("2026-07-28");
    expect(client.getDiscoverResult()?.supportedVersions).toContain(
      "2026-07-28",
    );
    const discovered = await client.discover();
    expect(discovered.supportedVersions).toContain("2026-07-28");
    expect(errors).toEqual([]);
  });
  it("lists and calls tools over the modern protocol", async () => {
    const { client, errors } = await connect({ pin: "2026-07-28" });
    await expectCurrentTimeToolWorks(client);
    expect(errors).toEqual([]);
  });
  it("selects the modern protocol in auto mode", async () => {
    const { client, errors } = await connect("auto");
    expect(client.getProtocolEra()).toBe("modern");
    expect(errors).toEqual([]);
  });
  it("serves legacy clients through the initialize handshake", async () => {
    const { client, errors } = await connect("legacy");
    expect(client.getProtocolEra()).toBe("legacy");
    await expectCurrentTimeToolWorks(client);
    expect(errors).toEqual([]);
  });
  it("falls back to initialize after a server/discover probe", async () => {
    const { clientTransport, errors } = serve();
    const { request, notify } = createRequester(clientTransport);
    await clientTransport.start();
    cleanups.push(() => clientTransport.close());
    const clientInfo = { name: "test-client", version: "0.0.0" };
    const discovered = await request("server/discover", {
      _meta: {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": clientInfo,
        "io.modelcontextprotocol/clientCapabilities": {},
      },
    });
    expect(discovered.supportedVersions).toContain("2026-07-28");
    const initialized = await request("initialize", {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo,
    });
    expect(initialized.protocolVersion).toBe("2025-11-25");
    await notify("notifications/initialized");
    const listed = await request("tools/list", {});
    expect(
      (listed.tools as Array<{ name: string }>).map((tool) => tool.name),
    ).toContain("garoon-get-current-time");
    expect(errors).toEqual([]);
  });
});
