import { StorageAdapter, fs, path, cwd } from './deps.deno.ts'

export class FileAdapter<T> implements StorageAdapter<T> {
  private folderPath: string

  constructor({ dirName }: { dirName: string }) {
    this.folderPath = path.resolve(cwd(), dirName)
    fs.ensureDirSync(this.folderPath)
  }

  private resolveSessionPath(key: string) {
    const subFolder = key.substr(-2)
    return path.resolve(this.folderPath, subFolder, `${key}.json`)
  }

  private async findSessionFile(key: string) {
    try {
      return await fs.readFile(this.resolveSessionPath(key))
    } catch (error) {
      return null
    }
  }

  async read(key: string) {
    const file = await this.findSessionFile(key)

    if (!file) {
      return undefined
    }

    return JSON.parse(file) as T
  }

  async write(key: string, value: T) {
    const fullPath = this.resolveSessionPath(key)
    const folderPath = fullPath.replace(`${key}.json`, '')

    await fs.ensureDir(folderPath)
    await fs.writeFile(fullPath, JSON.stringify(value))
  }

  async delete(key: string) {
    await fs.remove(this.resolveSessionPath(key))
  }
}
