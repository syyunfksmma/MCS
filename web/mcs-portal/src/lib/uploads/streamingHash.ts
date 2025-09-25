import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

export interface StreamingHasher {
  update(chunk: Uint8Array): void;
  digest(): Promise<string>;
}

class NobleStreamingHasher implements StreamingHasher {
  private readonly hasher = sha256.create();

  update(chunk: Uint8Array) {
    this.hasher.update(chunk);
  }

  async digest(): Promise<string> {
    return bytesToHex(this.hasher.digest());
  }
}

export function createStreamingSha256(): StreamingHasher {
  return new NobleStreamingHasher();
}
