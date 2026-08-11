# Third-Party Code

## Dependencies

- **better-sqlite3** (pinned to `11.3.0`) — synchronous SQLite driver. Chosen
  because this is a local-first, single-user app with no concurrent request
  load, so an async driver adds no benefit, and the synchronous API keeps the
  data-access code in `lib/tasks.ts` simple and easy to test. Pinned to an
  exact version rather than a caret range because a newer version installed
  during development caused a native-binary access violation on Node 22.11.0
  (see Running It for details) — `11.3.0` is confirmed stable on this setup.

- **@types/better-sqlite3** — TypeScript type definitions for the above.

- **jest** + **ts-jest** — test runner and TypeScript transform. Chosen over
  the Next.js-integrated Jest config because the tests exercise plain
  functions in `lib/tasks.ts` with no dependency on React or Next's routing,
  so a minimal `ts-jest` setup avoids pulling in unnecessary Next-specific
  test config.

- **@types/jest** — type definitions so Jest's globals (`describe`, `it`,
  `expect`) type-check correctly.

- **tailwindcss** (via `create-next-app`) — utility-first styling, used
  throughout for layout, color, and typography without hand-written CSS files
  per component.

- **next/font/google** (Inter, JetBrains Mono) — not an installed package,
  but worth noting: fonts are loaded via Next's built-in font optimisation
  rather than a separate Google Fonts `<link>`, so they're self-hosted at
  build time with no runtime request to Google.