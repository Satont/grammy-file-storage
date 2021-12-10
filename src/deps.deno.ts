export type { StorageAdapter } from 'https://deno.land/x/grammy@v1.5.2/mod.ts'
import { exists, existsSync } from 'https://deno.land/std@0.111.0/fs/mod.ts'
import { resolve } from 'https://deno.land/std@0.111.0/path/mod.ts'

export const fs = {
  readFile: Deno.readTextFile,
  writeFile: Deno.writeTextFile,
  exists,
  existsSync,
  ensureDir: (path: string) => Deno.mkdir(path, { recursive: true }),
  ensureDirSync: (path: string) => Deno.mkdirSync(path, { recursive: true }),
  remove: Deno.remove
}

export const path = {
  resolve,
}

export const cwd = Deno.cwd
