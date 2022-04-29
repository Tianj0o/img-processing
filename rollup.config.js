import typescript from "@rollup/plugin-typescript";
export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'lib/img-processing.cjs.js'
    },
    {
      format: 'es',
      file: 'lib/img-processing.esm.js'
    },
  ],
  plugins: [typescript()]
}