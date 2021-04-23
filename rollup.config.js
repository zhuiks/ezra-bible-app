import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'app/frontend/webcomponents/init.js',
  plugins: [
    nodeResolve({
      // browser: true,
      // mainFields: ['browser'],
    }),
  ],
  output: {
    file: 'dist/components.js',
    format: 'es'
  },
  watch: {
    buildDelay: 500
  },
};