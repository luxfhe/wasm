/**
 * @luxfhe/wasm - LuxFHE WebAssembly bindings
 *
 * Pure Go TFHE implementation compiled to WebAssembly for browser use.
 * Provides client-side FHE operations: key generation, encryption, decryption.
 */

export interface LuxFHEKeys {
  publicKey: string;
  secretKey: string;
  bootstrapKey: string;
}

export interface LuxFHE {
  version(): string;
  generateKeys(): LuxFHEKeys;
  encrypt(value: number, bitWidth: number, publicKey: string): string;
  decrypt(ciphertext: string, secretKey: string): number;
  add(ct1: string, ct2: string, bootstrapKey: string, secretKey: string): string;
  sub(ct1: string, ct2: string, bootstrapKey: string, secretKey: string): string;
  eq(ct1: string, ct2: string, bootstrapKey: string, secretKey: string): string;
  lt(ct1: string, ct2: string, bootstrapKey: string, secretKey: string): string;
}

declare global {
  interface Window {
    luxfhe: LuxFHE;
    Go: any;
  }
}

let wasmInstance: WebAssembly.Instance | null = null;
let goInstance: any = null;
let initialized = false;

/**
 * Initialize the WASM module
 * Must be called before using any FHE functions
 */
export async function init(wasmUrl?: string): Promise<LuxFHE> {
  if (initialized && window.luxfhe) {
    return window.luxfhe;
  }

  // Load wasm_exec.js (Go's WASM runtime)
  if (typeof window !== 'undefined' && !window.Go) {
    const script = document.createElement('script');
    script.src = wasmUrl?.replace('tfhe.wasm', 'wasm_exec.js') || '/wasm/wasm_exec.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create Go instance
  goInstance = new window.Go();

  // Load and instantiate WASM
  const wasmPath = wasmUrl || '/wasm/tfhe.wasm';
  const response = await fetch(wasmPath);
  const wasmBuffer = await response.arrayBuffer();

  const result = await WebAssembly.instantiate(wasmBuffer, goInstance.importObject);
  wasmInstance = result.instance;

  // Run Go main()
  goInstance.run(wasmInstance);

  // Wait for luxfhe to be available
  await new Promise<void>((resolve) => {
    const check = () => {
      if (window.luxfhe) {
        resolve();
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });

  initialized = true;
  return window.luxfhe;
}

/**
 * Get the initialized LuxFHE instance
 * Throws if not initialized
 */
export function getLuxFHE(): LuxFHE {
  if (!initialized || !window.luxfhe) {
    throw new Error('LuxFHE not initialized. Call init() first.');
  }
  return window.luxfhe;
}

/**
 * Check if WASM is initialized
 */
export function isInitialized(): boolean {
  return initialized && !!window.luxfhe;
}

// Re-export types
export type { LuxFHE, LuxFHEKeys };

// Default export
export default init;
