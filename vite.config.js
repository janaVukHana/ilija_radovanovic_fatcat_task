import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    replace({
      'process.env': JSON.stringify(dotenv.config().parsed)
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'last 2 Chrome versions',
            useBuiltIns: 'entry',
            corejs: 3,
          },
        ],
        '@babel/preset-react',
      ],
      plugins: ['transform-inline-environment-variables'],
      exclude: /node_modules/,
    }),
  ],
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
});
