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
  [`progress` option](https://github.com/ehmicky/get-node/blob/master/README.md#getnodeversion-options).

# 5.3.0

## Features

- The
  [`progress` option](https://github.com/ehmicky/get-node/blob/master/README.md#getnodeversion-options)
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
  [`progress` option](https://github.com/ehmicky/get-node/blob/master/README.md#getnodeversion-options)
  default value from `true` to `false` when called programmatically. The
  [`--progress` CLI option](https://github.com/ehmicky/get-node/blob/master/README.md#--progress)
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
  [an `--output` flag](https://github.com/ehmicky/get-node/blob/master/README.md#--output)
  instead of a positional argument on the CLI. This means
  `get-node VERSION OUTPUT` should now be `get-node --output=OUTPUT VERSION`.

## Features

- Add `--help` and `--version` CLI flags
- Add
  [`--progress`](https://github.com/ehmicky/get-node/blob/master/README.md#--progress)
  CLI flag
- Add
  [`--mirror`](https://github.com/ehmicky/get-node/blob/master/README.md#--mirror)
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
