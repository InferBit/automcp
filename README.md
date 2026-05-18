# AutoMCP

**Automatically generate MCP (Model Context Protocol) servers from API specifications.**

AutoMCP turns any OpenAPI, Swagger, gRPC, or tRPC spec into a working MCP server that AI agents (Claude, ChatGPT, Cursor, and others) can discover and use. No SDK to install, no integration code to write — point AutoMCP at your spec and your API becomes agent-ready in seconds.

A project by [Inferbit](https://github.com/inferbit).

---

## Quick start

```bash
git clone --recursive https://github.com/inferbit/automcp
cd automcp
cp .env.example .env
docker-compose up -d
```

Open the dashboard at <http://localhost:3001>. The MCP endpoint is at <http://localhost:3000/mcp/{specId}>.

For a single-spec lightweight setup (no dashboard, no Docker), use the language packages directly:

```bash
# Node
npx @inferbit/automcp-cli --spec ./openapi.yaml --port 3000

# Python
pipx install 'inferbit-automcp[cli]'
automcp --spec ./openapi.yaml --port 3000
```

---

## What is AutoMCP?

AutoMCP is a **discovery layer** between AI agents and APIs.

- It parses your API spec at runtime and exposes each endpoint as an MCP tool.
- It never proxies your data — agents call your API directly using the tool definitions AutoMCP serves.
- It supports OpenAPI 3.x, Swagger 2.0, gRPC, and tRPC out of the box.
- It's open source, MIT licensed, deployable in one command via Docker.

A managed platform (`automcp-enterprise`) adds multi-tenancy, a public marketplace, autonomous-agent commerce via UCP (Universal Commerce Protocol), and ownership governance. The open-source stack you're looking at right now is the foundation everything else is built on.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        AI Agents                            │
│         Claude  ·  ChatGPT  ·  Cursor  ·  Others           │
└──────────────┬─────────────────────────────────────────────┘
               │ MCP (tool discovery)
               ▼
┌────────────────────────────────────────────────────────────┐
│                      AutoMCP                                │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐   │
│  │ automcp-api  │ ◄─►│  automcp-ui  │    │ Typesense  │   │
│  │  (Bun/Elysia)│    │  (Next.js)   │    │  (search)  │   │
│  └──────┬───────┘    └──────────────┘    └────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │   Language layer (Node @inferbit/* or Python automcp) │ │
│  │   — HTTP transport, MCP session state                 │ │
│  └──────────────────────────┬───────────────────────────┘ │
│                             │ FFI (pure data in/out)       │
│                             ▼                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            automcp-rs (Rust core crates)             │ │
│  │   spec parsing · IR · MCP gen · search indexing      │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
               │ direct API calls (AutoMCP never proxies)
               ▼
┌────────────────────────────────────────────────────────────┐
│            Your API · Stripe · Shopify · anything           │
└────────────────────────────────────────────────────────────┘
```

---

## Configuration

All configuration is in `.env`. See `.env.example` for the full list. The most common knobs:

| Variable | Default | What |
|---|---|---|
| `DOMAIN` | `automcp.localhost` | Public domain served by nginx |
| `SPEC_STORAGE` | `mongo` | `file` (single-node) or `mongo` (persistent) |
| `MONGO_URL` | `mongodb://mongo:27017/automcp` | Database connection |
| `TYPESENSE_API_KEY` | — | Search engine API key (set to a random string in prod) |

---

## Repositories

The full project is split across several repos under the [`inferbit`](https://github.com/inferbit) GitHub org:

| Repo | Purpose |
|---|---|
| [`automcp`](https://github.com/inferbit/automcp) | This repo. Docker Compose composition + docs. |
| [`automcp-rs`](https://github.com/inferbit/automcp-rs) | Rust core (`automcp` crate on crates.io). |
| [`automcp-node`](https://github.com/inferbit/automcp-node) | Node packages: `@inferbit/automcp-core`, `-cli`, `-server`. |
| [`automcp-py`](https://github.com/inferbit/automcp-py) | Python package: `inferbit-automcp` with extras `[cli]`, `[server]`, `[all]`. |
| [`automcp-api`](https://github.com/inferbit/automcp-api) | Self-hosted backend service (Bun + Elysia). |
| [`automcp-ui`](https://github.com/inferbit/automcp-ui) | Self-hosted dashboard (Next.js). |

The managed platform (`automcp-enterprise-*`) is a private commercial layer that extends the public repos via git submodule. Same code, plus multi-tenancy, marketplace, and UCP commerce.

---

## Documentation

Full docs live in [`docs/`](docs/). Highlights:

- `docs/00_ABSTRACT.md` — product overview
- `docs/01_REPOS.md` — full repo structure
- `docs/07_ARCHITECTURE.md` — technical architecture
- `docs/03_COMMERCE.md` — UCP integration and agent commerce
- `docs/11_AUTH.md` — authentication and delegated access

---

## License

MIT — see [LICENSE](LICENSE). The open-source repos in this list are all MIT-licensed; the private `automcp-enterprise-*` repos are proprietary.
