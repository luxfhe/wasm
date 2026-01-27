/**
 * LuxFHE WASM Node.js bindings
 *
 * Native Go FHE compiled to WebAssembly for Node.js
 * Includes backward-compatible exports for legacy TFHE interface
 */

import * as fs from 'fs';
import * as path from 'path';

// Go WASM runtime
declare const Go: any;

let wasmInstance: WebAssembly.Instance | null = null;
let goInstance: any = null;
let initPromise: Promise<void> | null = null;

/**
 * InitInput type for backward compatibility with legacy TFHE
 */
export type InitInput = string | URL | ArrayBuffer | WebAssembly.Module;

// Runtime placeholder for InitInput (needed for rollup bundling)
export const InitInput = null as unknown as InitInput;

/**
 * Initialize the FHE WASM module
 */
export async function init(): Promise<void> {
  if (wasmInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Load wasm_exec.js runtime
    const wasmExecPath = path.join(__dirname, '..', 'wasm', 'wasm_exec.js');
    require(wasmExecPath);

    const go = new Go();
    goInstance = go;

    // Load the WASM binary
    const wasmPath = path.join(__dirname, '..', 'wasm', 'luxfhe.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasmInstance = await WebAssembly.instantiate(wasmModule, go.importObject);

    // Run the Go program
    go.run(wasmInstance);
  })();

  return initPromise;
}

/**
 * Get the LuxFHE instance after initialization
 */
export function getLuxFHE(): any {
  if (!wasmInstance) {
    throw new Error('FHE not initialized. Call init() first.');
  }
  // Access the FHE API exposed by Go
  return (globalThis as any).luxfhe;
}

export interface LuxFHEKeys {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  evaluationKey: Uint8Array;
}

/**
 * Generate FHE keys
 */
export async function generateKeys(): Promise<LuxFHEKeys> {
  await init();
  const fhe = getLuxFHE();
  return fhe.generateKeys();
}

/**
 * Encrypt a value
 */
export async function encrypt(value: number | bigint, publicKey: Uint8Array): Promise<Uint8Array> {
  await init();
  const fhe = getLuxFHE();
  return fhe.encrypt(value, publicKey);
}

/**
 * Decrypt a ciphertext
 */
export async function decrypt(ciphertext: Uint8Array, privateKey: Uint8Array): Promise<bigint> {
  await init();
  const fhe = getLuxFHE();
  return fhe.decrypt(ciphertext, privateKey);
}

// ============================================================================
// Backward-compatible exports for legacy TFHE interface
// These are stubs that map to our native Go FHE implementation
// ============================================================================

/**
 * Initialize panic hook - stub for legacy compatibility
 */
export function init_panic_hook(): void {
  // No-op for native Go FHE
}

/**
 * Initialize thread pool - stub for legacy compatibility
 */
export async function initThreadPool(numThreads?: number): Promise<void> {
  // No-op for native Go FHE - Go handles concurrency natively
}

/**
 * TfheCompactPublicKey - stub class for legacy compatibility
 */
export class TfheCompactPublicKey {
  private key: Uint8Array;

  constructor(key?: Uint8Array) {
    this.key = key || new Uint8Array();
  }

  static deserialize(bytes: Uint8Array): TfheCompactPublicKey {
    return new TfheCompactPublicKey(bytes);
  }

  serialize(): Uint8Array {
    return this.key;
  }
}

/**
 * CompactPkeCrs - stub class for legacy compatibility
 */
export class CompactPkeCrs {
  static from_config(config: any, maxBits: number): CompactPkeCrs {
    return new CompactPkeCrs();
  }
}

/**
 * CompactPkePublicParams - stub class for legacy compatibility
 */
export class CompactPkePublicParams {
  static new(crs: CompactPkeCrs, maxBits: number): CompactPkePublicParams {
    return new CompactPkePublicParams();
  }

  static deserialize(bytes: Uint8Array): CompactPkePublicParams {
    return new CompactPkePublicParams();
  }

  serialize(): Uint8Array {
    return new Uint8Array();
  }
}

/**
 * CompactCiphertextList - stub class for legacy compatibility
 */
export class CompactCiphertextList {
  private data: Uint8Array;

  constructor(data?: Uint8Array) {
    this.data = data || new Uint8Array();
  }

  static builder(params: CompactPkePublicParams): CompactCiphertextListBuilder {
    return new CompactCiphertextListBuilder();
  }

  static deserialize(bytes: Uint8Array): CompactCiphertextList {
    return new CompactCiphertextList(bytes);
  }

  serialize(): Uint8Array {
    return this.data;
  }
}

/**
 * CompactCiphertextListBuilder - stub class for legacy compatibility
 */
export class CompactCiphertextListBuilder {
  push(value: any): CompactCiphertextListBuilder {
    return this;
  }

  build(): CompactCiphertextList {
    return new CompactCiphertextList();
  }

  build_with_proof_packed(
    key: TfheCompactPublicKey,
    load: ZkComputeLoad
  ): { list: CompactCiphertextList; proof: Uint8Array } {
    return {
      list: new CompactCiphertextList(),
      proof: new Uint8Array(),
    };
  }
}

/**
 * ZkComputeLoad enum - stub for legacy compatibility
 */
export enum ZkComputeLoad {
  Proof = 'Proof',
  Verify = 'Verify',
}

/**
 * Default export matching legacy TFHE init signature
 */
export default async function initTFHE(options?: { module_or_path?: InitInput }): Promise<void> {
  await init();
}
