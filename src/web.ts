/**
 * LuxFHE WASM Web bindings
 *
 * Native Go FHE compiled to WebAssembly for browser
 */

// Go WASM runtime
declare const Go: any;

let wasmInstance: WebAssembly.Instance | null = null;
let goInstance: any = null;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the FHE WASM module
 */
export async function init(wasmUrl?: string): Promise<void> {
  if (wasmInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Load wasm_exec.js if not already loaded
    if (typeof Go === 'undefined') {
      await loadScript(new URL('../wasm/wasm_exec.js', import.meta.url).href);
    }

    const go = new Go();
    goInstance = go;

    // Load the WASM binary
    const wasmPath = wasmUrl || new URL('../wasm/luxfhe.wasm', import.meta.url).href;
    const response = await fetch(wasmPath);
    const wasmBuffer = await response.arrayBuffer();
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasmInstance = await WebAssembly.instantiate(wasmModule, go.importObject);

    // Run the Go program
    go.run(wasmInstance);
  })();

  return initPromise;
}

/**
 * Load a script dynamically
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
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
