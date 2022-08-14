# JSONPanel-next

A pretty print JSON viewer inspired by [afeldman/jsonpanel](https://github.com/afeld/jsonpanel), but updated for the modern web:

- zero dependencies (no more jQuery)
- written in ES6 JavaScript and built with [Rollup](https://rollupjs.org)

## Installation

```bash
npm install jsonpanel-next
```

## Usage

Import as a module:

```js
import jsonpanel from 'jsonpanel-next';
```

Example usage:
```js
// jsonpanel takes a single options object for configuration
jsonpanel({
  selector: '#jsonpanel',           // query selector string to render the panel in
  data: {                           // an object to render
    str: '  some values to display',  
    num: 2,
    bool: true,
    nested: {
        desc: 'nesting is okay too',
        arr: [0, 1, 2, 3]
    }
  },
  valueTransformer: str => str.trim() // function to transform values before render
});
```

## Developing

Clone and install dependencies:

```bash
git clone https://github.com/Xenonym/jsonpanel-next.git
cd jsonpanel-next/
npm install
```

### Building

[Rollup](https://rollupjs.org) is used to build the project.

To build in development mode and watch for changes:

```bash
npm run dev
```

To build minified bundles for production:

```bash
npm run build
```

To copy libaries over to the demo directory:

```bash
npm run prep-demo
```


### Testing

[Jest](https://jestjs.io/) is used for unit testing. To run tests:

```bash
npm run test
```

Tests can be found in `test/`.

### Linting

[XO](https://github.com/xojs/xo) is used to enforce code style and linting. 

To check for errors:

```bash
npm run lint
```

To format code and autofix errors where possible:

```bash
npm run lint-fix
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.
For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
JSONPanel-next is licensed under the [MIT license](https://choosealicense.com/licenses/mit/).
