[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/get-node)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/get-node)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Download a specific version of Node.js.

The Node.js release is downloaded, uncompressed and untared to an executable
file ready to run.

# Hire me

Please
[reach out](https://www.linkedin.com/feed/update/urn:li:activity:7117265228068716545/)
if you're looking for a Node.js API or CLI engineer (11 years of experience).
Most recently I have been [Netlify Build](https://github.com/netlify/build)'s
and [Netlify Plugins](https://www.netlify.com/products/build/plugins/)'
technical lead for 2.5 years. I am available for full-time remote positions.

# Features

Fast:

- the download is cached
- the best compression algorithm available on your machine is used
- everything is streamed

Reliable:

- the binary is checked against
  [official checksums](https://github.com/nodejs/node#verifying-binaries)
- can be safely run concurrently
- atomic writes

Features include:

- Linux/Mac/Windows support
- works with old Node.js versions
- [progress bar](#progress)
- using [version ranges](#getnodeversion-options)
- specifying [a mirror website](#mirror) for nodejs.org
- helpful error messages
- can guess the current project's version using its
  [`.nvmrc` or `package.json` (`engines.node` field)](#getnodeversion-options)

# Example

```js
import getNode from 'get-node'

// Download a specific Node.js release
const { path, version } = await getNode('8')
console.log(path) // /home/user/.cache/nve/8.17.0/node
console.log(version) // 8.17.0
```

```js
// Download Node.js latest release
const { path, version } = await getNode('latest')
console.log(path) // /home/user/.cache/nve/16.3.0/node
console.log(version) // 16.3.0
```

```js
// Any version range can be used
await getNode('8.12.0')
await getNode('<7')
```

```js
// Download latest LTS Node.js version
await getNode('lts')
```

```js
// Download Node.js version from `~/.nvmrc` or the current process version
await getNode('global')
```

```js
// Download current directory's Node.js version using its `.nvmrc` or
// `package.json` (`engines.node` field)
await getNode('local')
```

```js
// Download Node.js version from a specific file like `.nvmrc` or `package.json`
await getNode('/path/to/.nvmrc')
```

```js
// Specify the output directory
const { path } = await getNode('8', {
  output: '/home/user/.cache/node_releases/',
})
console.log(path) // /home/user/.cache/node_releases/13.0.1/node
```

```js
// Use a mirror website
await getNode('8', { mirror: 'https://npmmirror.com/mirrors/node' })
```

```js
// Specify the CPU architecture
await getNode('8', { arch: 'x32' })
```

# Install

```bash
npm install get-node
```

`node >=18.18.0` must be globally installed. However any Node version can be
downloaded.

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

To use this module as a CLI instead, please check
[`get-node-cli`](https://github.com/ehmicky/get-node-cli).

# Usage

## getNode(versionRange, options?)

`versionRange`: `string`\
`options`: `object?`\
_Return value_: `Promise<object>`

`versionRange` can be:

- any [version range](https://github.com/npm/node-semver) such as `12`, `12.6.0`
  or `<12`
- `latest`: Latest available Node version
- `lts`: Latest LTS Node version
- `global`: Global Node version
  - Using the home directory [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) or
    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  - [Some similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
    used by other Node.js version managers are also searched for
  - If nothing is found, defaults to the current process's Node version
- `local`: Current directory's Node version
  - Using the current directory or parent directories
    [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
    or
    [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
  - Defaults to the `global` version
- a file path towards a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
  [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  or
  [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)

### Options

#### output

_Type_: `string`\
_Default_: [global cache directory](https://github.com/ehmicky/global-cache-dir)
such as `/home/user/.cache/nve/`.

Output directory for the `node` executable.

It the directory already has a `node` executable, no download is performed. This
enables caching.

#### progress

_Type_: `boolean`\
_Default_: `false`

Whether to show a progress bar.

#### mirror

_Type_: `string`\
_Default_: `https://nodejs.org/dist`

Base URL to retrieve Node.js binaries. Can be customized (for example
`https://npmmirror.com/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

#### fetch

_Type_: `boolean`\
_Default_: `undefined`

The list of available Node.js versions is cached for one hour by default. If the
`fetch` option is:

- `true`: the cache will not be used
- `false`: the cache will be used even if it's older than one hour

#### arch

_Type_: `string`\
_Default_: [`process.arch`](https://nodejs.org/api/process.html#process_process_arch)

Node.js binary's CPU architecture. This is useful for example when you're on x64
but would like to run Node.js x32.

All the values from
[`process.arch`](https://nodejs.org/api/process.html#process_process_arch) are
allowed except `mips` and `mipsel`.

#### cwd

_Type_: `string | URL`\
_Default_: `.`

When using the [`local` alias](#getnodeversion-options), start looking for a
Node.js version file from this directory.

#### signal

_Type_:
[`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

Cancels when the signal is aborted.

### Return value

The returned `Promise` resolves to an object with the following properties.

#### path

_Type_: `string`

Absolute path to the `node` executable.

#### version

_Type_: `string`

[Normalized](https://github.com/ehmicky/normalize-node-version) Node.js version.

# See also

- [`get-node-cli`](https://github.com/ehmicky/get-node-cli): `get-node` as a CLI
- [`nve`](https://github.com/ehmicky/nve): Run a specific Node.js version (CLI)
- [`nvexeca`](https://github.com/ehmicky/nve): Run a specific Node.js version
  (programmatic)
- [`preferred-node-version`](https://github.com/ehmicky/preferred-node-version):
  Get the preferred Node.js version of a project or user
- [`node-version-alias`](https://github.com/ehmicky/node-version-alias): Resolve
  Node.js version aliases like `latest`, `lts` or `erbium`
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org
- [`global-cache-dir`](https://github.com/ehmicky/global-cache-dir): Get the
  global cache directory

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

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

Thanks go to our wonderful contributors:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/get-node/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/get-node/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://tunnckoCore.com"><img src="https://avatars3.githubusercontent.com/u/5038030?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Charlike Mike Reagent</b></sub></a><br /><a href="https://github.com/ehmicky/get-node/issues?q=author%3AtunnckoCore" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://instagram.com/private.number_"><img src="https://avatars.githubusercontent.com/u/1075694?v=4?s=100" width="100px;" alt=""/><br /><sub><b>hiroki osame</b></sub></a><br /><a href="https://github.com/ehmicky/get-node/commits?author=privatenumber" title="Code">💻</a> <a href="https://github.com/ehmicky/get-node/commits?author=privatenumber" title="Tests">⚠️</a> <a href="#ideas-privatenumber" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
