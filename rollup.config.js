import nodeResolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'app/frontend/webcomponents/init.js',
  plugins: [
    nodeResolve({
      // browser: true,
      // mainFields: ['browser'],
    }),
    sourcemaps(),
  ],
  output: {
    sourcemap: true,
    file: 'dist/components.js',
    format: 'es'
  },
  watch: {
    buildDelay: 500
  },
};