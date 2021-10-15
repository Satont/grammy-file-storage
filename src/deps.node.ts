export type { StorageAdapter } from 'grammy'
import { readFile, writeFile, rm } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export const fs = {
  readFile: (path: string) => readFile(path, { encoding: 'utf-8' }),
  writeFile,
  existsSync,
  ensureDirSync: (path: string) => {
    console.log(path, existsSync(path))
    if (!existsSync(path)) {
      mkdirSync(path)
    }
  },
  remove: (path: string) => rm(path, { recursive: true })
}

export const path = {
  resolve,
}

export const cwd = process.cwd
