import fs from 'node:fs';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import terser from '@rollup/plugin-terser';

// Workaround as ESLint will not support import assertions until Stage 4
const pkg = JSON.parse(fs.readFileSync('./package.json'));

const banner =
  '/*!\n' +
  ` * jsonpanel-next v${pkg.version}\n` +
  ` * (c) ${new Date().getFullYear()} Tan Zhen Yong\n` +
  ' * Released under the MIT License.\n' +
  ' */\n';

const config = [
  // CommonJS and ES modules, non-minified.
  {
    input: 'src/main.js',
    output: [
      {file: pkg.main, format: 'cjs', banner},
      {file: pkg.module, format: 'es', banner},
    ],
    plugins: [
      postcss({
        plugins: [postcssPresetEnv()],
      }),
    ],
  },

  // Minified ES build for browsers.
  {
    input: 'src/main.js',
    output: {
      file: pkg.module.replace('.js', '.min.js'),
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      postcss({
        minimize: true,
        plugins: [postcssPresetEnv()],
        sourceMap: true,
      }),
      terser({
        format: {
          comments(_, {type, value}) {
            if (type === 'comment2') {
              // Multiline comment, pass unminified if it is copyright banner
              return /\(c\)/i.test(value);
            }
          },
        },
      }),
    ],
  },
];

export default config;
