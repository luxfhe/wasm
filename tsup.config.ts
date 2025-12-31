import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/web.ts' },
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['tfhe'],
  },
  {
    entry: { index: 'src/node.ts' },
    outDir: 'dist/node',
    format: ['esm', 'cjs'],
    dts: true,
    external: ['node-tfhe'],
  },
]);
