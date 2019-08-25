[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/get-node.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/get-node)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/get-node)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/get-node.svg?logo=gitter)](https://gitter.im/ehmicky/get-node)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Download a specific version of Node.js.

This is cached: if the output directory already has a `node` executable, no
download will be performed.

Works on Linux/Mac/Windows.

# Example

```bash
# Download Node.js latest release
$ get-node
/home/ehmicky/.cache/nve/12.9.1/node
$ /home/ehmicky/.cache/nve/12.9.1/node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> .exit

# Download a specific Node.js release
$ get-node 8
/home/ehmicky/.cache/nve/8.16.1/node
$ /home/ehmicky/.cache/nve/8.16.1/node
> process.version
'v8.16.1'
> .exit

# Any version range can be used
$ get-node 8.12.0
$ get-node '<7'

# Specify the output directory
$ get-node 12 ~/.cache/node_releases/
$ ~/.cache/node_releases/12.9.1/node --version
v12.9.1
```

# Install

```bash
npm install get-node
```

`node >=8.12.0` must already be installed.

# Usage (CLI)

```bash
get-node [VERSION] [OUTPUT_DIRECTORY]
```

`VERSION` can be any [version range](https://github.com/npm/node-semver) such as
`12`, `12.6.0` or `<12`.

`OUTPUT_DIRECTORY` defaults to a
[global cache directory](https://github.com/ehmicky/global-cache-dir) such as
`/home/ehmicky/.cache/nve/`.

# Usage (JavaScript)

```js
const getNode = require('get-node')

const version = '12'
const options = {}
const { path, version } = await getNode(version, options)
console.log(path) // /home/ehmicky/.cache/nve/12.9.1/node
console.log(version) // 12.9.1
```

## getNode(version, options?)

`version`: `string`<br>`options`: `object`

### options.output

_Type_: `string`

### options.progress

_Type_: `boolean`<br> _Default_: `true`

Whether to show a progress spinner.

## Node.js mirror

The binary is downloaded from `https://nodejs.org/dist`. You can specify a
mirror website using the environment variable `NODE_MIRROR`.

```bash
NODE_MIRROR="https://npm.taobao.org/mirrors/node" get-node [VERSION] [OUTPUT_DIRECTORY]
```

# See also

- [`nve`](https://github.com/ehmicky/nve): Run a specific Node.js version
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/get-node).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/get-node/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/get-node/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
