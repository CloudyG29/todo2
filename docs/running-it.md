# Running It

## Requirements

- **Node.js v22.11.0** (LTS). This is required, not just recommended:
  `better-sqlite3` does not reliably have prebuilt binaries for every Node
  version, and compiling it from source on Windows requires Visual Studio's
  C++ build tools, which most machines won't have installed. Node 22 LTS has
  confirmed prebuilt binary support.
- **Do not run this project from inside a OneDrive-synced folder.** During
  development, running from a OneDrive path caused `better-sqlite3`'s native
  binary to crash with an access violation (Windows exit code
  `-1073741819` / `0xC0000005`) even on a fresh install. Moving the project
  to a plain local path resolved it. Clone this repository somewhere outside
  any cloud-sync folder (OneDrive, Dropbox, Google Drive, etc.).

## Install

```bash
git clone <your-repo-url>
cd todo-app
npm install
```

`better-sqlite3` is pinned to version `11.3.0` in `package.json` — this
version is confirmed working on Node 22.11.0. If `npm install` still fails
with a native compile error (`node-gyp` / "Could not find any Visual Studio
installation"), it means `npm` fell back to compiling from source; this
indicates a version/platform mismatch outside what's been tested here.

## Run

```bash
npm run dev
```

Then open `http://localhost:3000` in a browser. The app must be accessed via
`http://localhost:3000`, not by opening any file directly — it is a Next.js
server application, not a static site.

On first run, the SQLite database file is created automatically at
`data/todo.db` (the `data/` directory is created if it does not already
exist), so no manual setup step is required.

## Test

```bash
npm test
```

Tests run against a fresh in-memory SQLite database (`:memory:`) created per
test file, so they do not read or write `data/todo.db` and do not depend on
any pre-existing data.

## Build (optional, for a production check)

```bash
npm run build
npm start
```