# 3.2.0

## Features

- Add `--help` and `--version` CLI flags
- Add
  [`--progress`](https://github.com/ehmicky/nve/blob/master/README.md#progress)
  CLI flag
- Add [`--mirror`](https://github.com/ehmicky/nve/blob/master/README.md#mirror)
  option

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
