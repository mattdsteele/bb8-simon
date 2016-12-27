import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/bb8-buttons.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
