import type * as fsa from '../fsa/types';
import type * as misc from '../node/types/misc';

export class FsaNodeFsOpenFile {
  protected seek: number = 0;

  /**
   * This influences the behavior of the next write operation. On the first
   * write we want to overwrite the file or keep the existing data, depending
   * with which flags the file was opened. On subsequent writes we want to
   * append to the file.
   */
  protected keepExistingData: boolean = false;

  public constructor(
    public readonly fd: number,
    public readonly mode: misc.TMode,
    public readonly flags: number,
    public readonly file: fsa.IFileSystemFileHandle,
  ) {}

  public async close(): Promise<void> {}

  public async write(data: Uint8Array, seek: number | null): Promise<void> {
    if (typeof seek !== 'number') seek = this.seek;
    const writer = await this.file.createWritable({keepExistingData: this.keepExistingData});
    await writer.write({
      type: 'write',
      data,
      position: seek,
    });
    await writer.close();
    this.keepExistingData = true;
    this.seek += data.length;
  }
}
