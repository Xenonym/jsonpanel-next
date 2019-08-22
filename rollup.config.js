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
      buble({
        exclude: ['node_modules/**']
      })
    ]
  },

  // Process styles, non-minified.
  {
    input: 'src/styles/jsonpanel-next.scss',
    output: {
      file: 'dist/jsonpanel-next.css',
      format: 'es' // Dummy output format, will output as CSS file.
    },
    plugins: [
      postcss({
        extract: true,
        plugins: [postcssPresetEnv()]
      })
    ]
  },

  // Minified UMD build for browsers.
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name: 'jsonpanelNext'
    },
    plugins: [
      buble({
        exclude: ['node_modules/**']
      }),
      uglify({
        output: {
          preamble: banner
        }
      })
    ]
  },

  // Process styles, minified.
  {
    input: 'src/styles/jsonpanel-next.scss',
    output: {
      file: 'dist/jsonpanel-next.min.css',
      format: 'es' // Dummy output format, will output as CSS file.
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        plugins: [postcssPresetEnv()]
      })
    ]
  }
];
