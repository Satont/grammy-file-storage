import { StorageAdapter, fs, path, cwd } from './deps.deno.ts';

type ConstructorOptions = {
  dirName?: string;
  serializer?: (input: any) => string;
  deserializer?: (input: string) => unknown;
};

export class FileAdapter<T> implements StorageAdapter<T> {
  private folderPath: string;
  serializer: ConstructorOptions['serializer'];
  deserializer: ConstructorOptions['deserializer'];

  /**
   * @constructor
   * @param {opts} options options
   * @param {opts.dirname} options.ttl - name of directory where files should be stored.
   * @param {opts.serializer} options.serializer
   * serializer of file. Default `JSON.stringify(input, null, '\t')`.
   *
   * @param {opts.deserializer} options.deserializer
   * deserializer of file. Default `JSON.parse(input)`.
   */
  constructor(opts: ConstructorOptions = {}) {
    this.folderPath = path.resolve(cwd(), opts?.dirName ?? 'sesions');

    if (!opts.serializer) {
      this.serializer = (input) => JSON.stringify(input, null, '\t');
    }

    if (!opts.deserializer) {
      this.deserializer = (input: string) => JSON.parse(input);
    }

    fs.ensureDirSync(this.folderPath);
  }

  private resolveSessionPath(key: string) {
    const subFolder = key.substr(-2);
    return path.resolve(this.folderPath, subFolder, `${key}.json`);
  }

  private async findSessionFile(key: string) {
    try {
      return await fs.readFile(this.resolveSessionPath(key));
    } catch (error) {
      return null;
    }
  }

  async read(key: string) {
    const file = await this.findSessionFile(key);

    if (!file) {
      return undefined;
    }

    return this.deserializer!(file) as T;
  }

  async write(key: string, value: T) {
    const fullPath = this.resolveSessionPath(key);
    const fileName = `${key}.json`;
    const folderPath = fullPath.substring(0, fullPath.length - fileName.length);

    await fs.ensureDir(folderPath);
    await fs.writeFile(fullPath, this.serializer!(value));
  }

  async delete(key: string) {
    await fs.remove(this.resolveSessionPath(key));
  }
}
