export type { StorageAdapter } from 'https://deno.land/x/grammy@v1.3.3/mod.ts'
import { exists, existsSync, ensureDirSync } from 'https://deno.land/std@0.77.0/fs/mod.ts'
import { resolve } from 'https://deno.land/std@0.110.0/path/mod.ts'

export const fs = {
  readFile: Deno.readTextFile,
  writeFile: Deno.writeTextFile,
  exists,
  existsSync,
  ensureDirSync,
  remove: Deno.remove
}

export const path = {
  resolve,
}

export const cwd = Deno.cwd
