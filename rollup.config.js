import buble from 'rollup-plugin-buble';
import {uglify} from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
// eslint-disable-next-line import/extensions
import pkg from './package.json';

const banner =
  '/*!\n' +
  ` * jsonpanel-next v${pkg.version}\n` +
  ` * (c) ${new Date().getFullYear()} Tan Zhen Yong\n` +
  ' * Released under the MIT License.\n' +
  ' */\n';

export default [
  // UMD, CommonJS and ES modules, non-minified.
  {
    input: 'src/main.js',
    output: [
      {file: pkg.browser, format: 'umd', banner, name: 'jsonpanelNext'},
      {file: pkg.main, format: 'cjs', banner},
      {file: pkg.module, format: 'es', banner}
    ],
    plugins: [
      postcss({
        plugins: [postcssPresetEnv()]
      }),
      buble({
        exclude: ['node_modules/**']
      })
    ]
  },

  // Minified UMD build for browsers.
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name: 'jsonpanelNext',
      sourcemap: true
    },
    plugins: [
      postcss({
        minimize: true,
        plugins: [postcssPresetEnv()],
        sourceMap: true
      }),
      buble({
        exclude: ['node_modules/**']
      }),
      uglify({
        output: {
          preamble: banner
        }
      })
    ]
  }
];
