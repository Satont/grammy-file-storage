# PSQL storage adapter for grammY

Storage adapter that can be used to
[store your session data](https://grammy.dev/plugins/session.html) in
[PostgreSQL](https://www.postgresql.org/) when using sessions.

## Installation

Node

```bash
npm install @satont/grammy-psql-storage pg --save
```

Deno

```ts
import { PsqlAdapter } from "https://deno.land/x/grammy_psql_storage/mod.ts";
import { Client } from "https://deno.land/x/pg/mod.ts";
```

## Usage

You can check
[examples](https://github.com/Satont/grammy-psql-storage/tree/main/examples)
folder
