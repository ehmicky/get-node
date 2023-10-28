# 15.0.0

## Breaking changes

- Minimal supported Node.js version is now `18.18.0`

# 14.2.1

## Dependencies

- Upgrade [Execa](https://github.com/sindresorhus/execa) to
  [`8.0.0`](https://github.com/sindresorhus/execa/releases/tag/v8.0.0)

# 14.2.0

## Features

- The version can now be specified as a file path to a
  [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
  [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  or
  [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md).

```js
const { path, version } = await getNode('/path/to/.nvmrc')
```

# 14.1.0

## Features

- Add a [`signal` option](README.md#signal) to cancel

# 14.0.0

## Breaking changes

- Minimal supported Node.js version is now `16.17.0`

# 13.6.0

## Features

- Upgrade Execa

# 13.5.0

## Features

- Improve tree-shaking support

# 13.4.0

## Features

- Reduce npm package size by 53%

# 13.3.0

## Features

- Reduce npm package size

# 13.2.0

## Features

- Reduce npm package size

# 13.1.0

## Features

- Improve TypeScript types

# 13.0.1

## Dependencies

- Upgrade `node-version-alias`

# 13.0.0

## Breaking changes

- Minimal supported Node.js version is now `14.18.0`

## Features

- The [`cwd` option](https://github.com/ehmicky/get-node#cwd) can now be a
  `file:` URL

# 12.1.0

## Features

- Add TypeScript types.

# 12.0.0

## Breaking changes

- Minimal supported Node.js version is now `12.20.0`
- This package is now an ES module. It can only be loaded with an `import` or
  `import()` statement, not `require()`. See
  [this post for more information](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

# 11.0.2

## Bug fixes

- Fix issue with `SIGINT` handlers

# 11.0.1

## Bug fixes

- Fix crash when downloading several Node.js binaries in parallel

# 11.0.0

## Breaking changes

- Rename the [alias `here`](/README.md#getnodeversion-options) to `local`

## Features

- Add the [alias `global`](/README.md#getnodeversion-options) to target the
  global Node version, regardless of the current directory

# 10.0.0

## Breaking changes

- Rename the [alias `now`](/README.md#getnodeversion-options) to `here`

# 9.0.0

## Breaking changes

- Aliases `c` and `current` renamed to `now`
- The [alias `now`](/README.md#getnodeversion-options) now takes into account
  `package.json` `engines.node` field and
  [additional files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
  used by other Node.js version managers.
- Alias `l` removed: please use `latest` instead

## Features

- Added [alias `lts`](/README.md#getnodeversion-options) to target the latest
  LTS version

# 8.0.1

## Bug fixes

- Fix aliases shortcuts `l` and `c`

# 8.0.0

## Breaking changes

- Rename `*` alias to [`latest` or `l`](/README.md#getnodeversion-options)
- Rename `.` alias to [`current` or `c`](/README.md#getnodeversion-options)
- Remove `_` alias

# 7.3.1

## Dependencies

- Fix removing `core-js`

# 7.3.0

## Features

- Add [`fetch` option](/README.md#fetch) to control caching

## Bug fixes

- Checksum checks were not working when the `mirror` option was used

## Dependencies

- Remove `core-js`

# 7.2.2

## Bug fixes

- Fix `cwd` option

# 7.2.1

## Bug fixes

- Fix `_` and `.` aliases not working

# 7.2.0

## Features

- Can use the `_` alias to refer to the
  [current process's Node.js version](/README.md#getnodeversion-options)
- Can use the `.` alias to refer to the
  [current project's Node.js version](/README.md#getnodeversion-options) using
  its `.nvmrc`, `.node-version` or `.naverc`. The current directory can be
  changed using the [`cwd` option](/README.md#cwd).

# 7.1.2

## Bug fixes

- Fix terminal color changing on Windows

# 7.1.1

## Bug fixes

- Fix [`arch` option](https://github.com/ehmicky/get-node#arch)

# 7.1.0

## Features

- Add [`arch` option](https://github.com/ehmicky/get-node#arch) to specify the
  CPU architecture.

# 7.0.0

## Breaking changes

- Minimal supported Node.js version is now `10.17.0`

# 6.6.0

## Features

- Node.js binary download is now 50% faster on Windows

## Bug fixes

- Fix crash when Node.js binary URL is invalid

# 6.5.0

## Features

- Node.js binary download is now twice faster on Windows

## Bug fixes

- Fix ARM, PowerPC, S390 support

# 6.4.0

## Features

- Improve the internal directory structure used to cache the Node.js binary
- Cleanup temporary files when Node.js download fails

# 6.3.0

## Features

- Improve the appearance of the progress bar

# 6.2.0

## Features

- Ensure Node.js binaries are not corrupted by checking their
  [checksums](https://github.com/nodejs/node#verifying-binaries)
- Use cache when offline (no network connection)

# 6.1.0

## Features

- Make Node.js binary download twice faster on Linux and MacOS
- Improve error messages

## Bug fixes

- Fix downloading Node.js `0.12` and below on Windows

# 6.0.1

## Dependencies

- Reduce the number of dependencies

# 6.0.0

## Breaking changes

- Separate the CLI into its own repository and npm package
  [`get-node-cli`](https://github.com/ehmicky/get-node-cli) to reduce the number
  of dependencies.

# 5.5.0

## Dependencies

- Upgrade `fetch-node-website` to `4.0.0`
- Upgrade `normalize-node-version` to `5.1.0`

# 5.4.1

## Bug fixes

- Fix progress bar jitter.

# 5.4.0

## Features

- Improve the appearance of the progress bar with the
  [`progress` option](https://github.com/ehmicky/get-node/blob/main/README.md#getnodeversion-options).

# 5.3.0

## Features

- The
  [`progress` option](https://github.com/ehmicky/get-node/blob/main/README.md#getnodeversion-options)
  now displays a progress bar instead of a spinner.

# 5.2.0

## Features

- Show percentage instead of number of megabytes in spinner

# 5.1.0

## Features

- Improve speed

# 5.0.0

## Breaking changes

- Change the
  [`progress` option](https://github.com/ehmicky/get-node/blob/main/README.md#getnodeversion-options)
  default value from `true` to `false` when called programmatically. The
  [`--progress` CLI option](https://github.com/ehmicky/get-node/blob/main/README.md#--progress)
  still defaults to `true`.

# 4.0.3

## Internal

- Internal changes

# 4.0.2

## Bugs

- Improve error messages

# 4.0.1

## Bugs

- Fix `CTRL-C` not working

# 4.0.0

## Breaking changes

- The output directory is now specified as
  [an `--output` flag](https://github.com/ehmicky/get-node/blob/main/README.md#--output)
  instead of a positional argument on the CLI. This means
  `get-node VERSION OUTPUT` should now be `get-node --output=OUTPUT VERSION`.

## Features

- Add `--help` and `--version` CLI flags
- Add
  [`--progress`](https://github.com/ehmicky/get-node/blob/main/README.md#--progress)
  CLI flag
- Add
  [`--mirror`](https://github.com/ehmicky/get-node/blob/main/README.md#--mirror)
  option
- Improve CLI spinner

## Bugs

- Fix error messages not printed correctly
  ([50128cd](https://github.com/ehmicky/get-node/commit/3a1e347f9d1e355679858a99393218cd96f1d1d2))

# 3.1.0

## Features

- Improve progress messages on console
- Add alternative names for `NODE_MIRROR`: `NVM_NODEJS_ORG_MIRROR`,
  `N_NODE_MIRROR` and `NODIST_NODE_MIRROR`

# 3.0.1

## Bugs

- Fix cache invalidation bug

# 3.0.0

## Breaking changes

- The output directory now defaults to a global cache directory instead of the
  current directory.

## Features

- The Node.js/programmatic API is now documented and exposed

# 2.0.1

## Internal

- Internal changes

# 2.0.0

## Features

- Retry downloading the Node.js binaries on network errors

# 1.1.0

## Features

- A spinner is now shown when a new Node.js version is downloading
