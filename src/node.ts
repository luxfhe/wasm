/**
 * LuxFHE WASM Node.js bindings
 *
 * Native Go FHE compiled to WebAssembly for Node.js
 */

import * as fs from 'fs';
import * as path from 'path';

// Go WASM runtime
declare const Go: any;

let wasmInstance: WebAssembly.Instance | null = null;
let goInstance: any = null;

/**
 * Initialize the FHE WASM module
 */
export async function init(): Promise<void> {
  if (wasmInstance) return;

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

export default {
  init,
  getLuxFHE,
  generateKeys,
  encrypt,
  decrypt,
};
