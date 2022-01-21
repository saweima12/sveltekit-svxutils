import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import sucrase from '@rollup/plugin-sucrase';
import dts from 'rollup-plugin-dts';

import pkg from './package.json';

export default [
  {
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      sucrase({ transforms: ['typescript'] })
    ],
    input: 'src/main.ts',
    output: [
      { file: pkg.module, format: 'es', sourcemap: false },
      { file: pkg.main, format: 'cjs', sourcemap: false }
    ]
  },
  {
    plugins: [dts()],
    input: 'src/main.ts',
    output: [
      { file: 'dist/main.es.d.ts', format: 'es' },
      { file: 'dist/main.cjs.d.ts', format: 'cjs' }
    ]
  }
]
