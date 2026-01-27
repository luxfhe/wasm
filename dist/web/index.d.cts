/**
 * LuxFHE WASM Web bindings
 *
 * Native Go FHE compiled to WebAssembly for browser
 * Includes backward-compatible exports for legacy TFHE interface
 */
/**
 * InitInput type for backward compatibility with legacy TFHE
 */
type InitInput = string | URL | Request | Response | ArrayBuffer | WebAssembly.Module;
declare const InitInput: InitInput;
/**
 * Initialize the FHE WASM module
 */
declare function init(wasmUrl?: string): Promise<void>;
/**
 * Get the LuxFHE instance after initialization
 */
declare function getLuxFHE(): any;
interface LuxFHEKeys {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    evaluationKey: Uint8Array;
}
/**
 * Generate FHE keys
 */
declare function generateKeys(): Promise<LuxFHEKeys>;
/**
 * Encrypt a value
 */
declare function encrypt(value: number | bigint, publicKey: Uint8Array): Promise<Uint8Array>;
/**
 * Decrypt a ciphertext
 */
declare function decrypt(ciphertext: Uint8Array, privateKey: Uint8Array): Promise<bigint>;
/**
 * Initialize panic hook - stub for legacy compatibility
 */
declare function init_panic_hook(): void;
/**
 * Initialize thread pool - stub for legacy compatibility
 */
declare function initThreadPool(numThreads?: number): Promise<void>;
/**
 * TfheCompactPublicKey - stub class for legacy compatibility
 */
declare class TfheCompactPublicKey {
    private key;
    constructor(key?: Uint8Array);
    static deserialize(bytes: Uint8Array): TfheCompactPublicKey;
    serialize(): Uint8Array;
}
/**
 * CompactPkeCrs - stub class for legacy compatibility
 */
declare class CompactPkeCrs {
    static from_config(config: any, maxBits: number): CompactPkeCrs;
}
/**
 * CompactPkePublicParams - stub class for legacy compatibility
 */
declare class CompactPkePublicParams {
    static new(crs: CompactPkeCrs, maxBits: number): CompactPkePublicParams;
    static deserialize(bytes: Uint8Array): CompactPkePublicParams;
    serialize(): Uint8Array;
}
/**
 * CompactCiphertextList - stub class for legacy compatibility
 */
declare class CompactCiphertextList {
    private data;
    constructor(data?: Uint8Array);
    static builder(params: CompactPkePublicParams): CompactCiphertextListBuilder;
    static deserialize(bytes: Uint8Array): CompactCiphertextList;
    serialize(): Uint8Array;
}
/**
 * CompactCiphertextListBuilder - stub class for legacy compatibility
 */
declare class CompactCiphertextListBuilder {
    push(value: any): CompactCiphertextListBuilder;
    build(): CompactCiphertextList;
    build_with_proof_packed(key: TfheCompactPublicKey, load: ZkComputeLoad): {
        list: CompactCiphertextList;
        proof: Uint8Array;
    };
}
/**
 * ZkComputeLoad enum - stub for legacy compatibility
 */
declare enum ZkComputeLoad {
    Proof = "Proof",
    Verify = "Verify"
}
/**
 * Default export matching legacy TFHE init signature
 */
declare function initTFHE(options?: {
    module_or_path?: InitInput;
}): Promise<void>;

export { CompactCiphertextList, CompactCiphertextListBuilder, CompactPkeCrs, CompactPkePublicParams, InitInput, type LuxFHEKeys, TfheCompactPublicKey, ZkComputeLoad, decrypt, initTFHE as default, encrypt, generateKeys, getLuxFHE, init, initThreadPool, init_panic_hook };
