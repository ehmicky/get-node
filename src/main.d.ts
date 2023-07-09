import type { Options as FetchNodeWebsiteOptions } from 'fetch-node-website'
import type { Options as NodeVersionAliasOptions } from 'node-version-alias'
import type {
  Options as PreferredNodeVersionOptions,
  SemverVersion,
} from 'preferred-node-version'

export type { SemverVersion }

export interface NodeBinary {
  /**
   * Absolute path to the `node` executable
   */
  path: string

  /**
   * Normalized Node.js version
   */
  version: SemverVersion
}

/**
 * CPU architecture
 */
type Arch =
  | 'arm'
  | 'arm64'
  | 'ia32'
  | 'mips'
  | 'mipsel'
  | 'ppc'
  | 'ppc64'
  | 's390'
  | 's390x'
  | 'x64'

// @ts-error @typescript-eslint/no-duplicate-type-constituents
type UpstreamOptions = FetchNodeWebsiteOptions & NodeVersionAliasOptions

// @ts-error @typescript-eslint/no-duplicate-type-constituents
type AllUpstreamOptions = UpstreamOptions & PreferredNodeVersionOptions

export type Options = Partial<{
  /**
   * Output directory for the `node` executable.
   * It the directory already has a `node` executable, no download is
   * performed. This enables caching.
   *
   * @default Global cache directory such as `/home/user/.cache/nve/`
   */
  output: string

  /**
   * Whether to show a progress bar.
   *
   * @default false
   */
  progress: FetchNodeWebsiteOptions['progress']

  /**
   * Base URL to retrieve Node.js binaries.
   * Can be customized (for example `https://npmmirror.com/mirrors/node`).
   * The following environment variables can also be used: `NODE_MIRROR`,
   * `NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.
   *
   * @default "https://nodejs.org/dist"
   */
  mirror: AllUpstreamOptions['mirror']

  /**
   * Cancels when the signal is aborted.
   */
  signal?: AllUpstreamOptions['signal']

  /**
   * The list of available Node.js versions is cached for one hour by default.
   * If the `fetch` option is:
   *  - `true`: the cache will not be used
   *  - `false`: the cache will be used even if it's older than one hour
   *
   * @default undefined
   */
  fetch: UpstreamOptions['fetch']

  /**
   * Node.js binary's CPU architecture. This is useful for example when you're
   * on x64 but would like to run Node.js x32.
   * All the values from
   * [`process.arch`](https://nodejs.org/api/process.html#process_process_arch)
   * are allowed except `mips` and `mipsel`.
   *
   * @default `process.arch`
   */
  arch: Arch

  /**
   * When using the `local` alias, start looking for a Node.js version file
   * from this directory.
   *
   * @default "."
   */
  cwd: string | URL
}>

/**
 * Download a specific version of Node.js.
 * The Node.js release is downloaded, uncompressed and untared to an executable
 * file ready to run.
 *
 * @example
 * ```js
 * // Download a specific Node.js release
 * const { path, version } = await getNode('8')
 * console.log(path) // /home/user/.cache/nve/8.17.0/node
 * console.log(version) // 8.17.0
 *
 * // Download Node.js latest release
 * const { path, version } = await getNode('latest')
 * console.log(path) // /home/user/.cache/nve/16.3.0/node
 * console.log(version) // 16.3.0
 *
 * // Any version range can be used
 * await getNode('8.12.0')
 * await getNode('<7')
 *
 * // Download latest LTS Node.js version
 * await getNode('lts')
 *
 * // Download Node.js version from `~/.nvmrc` or the current process version
 * await getNode('global')
 *
 * // Download current directory's Node.js version using its `.nvmrc` or `package.json` (`engines.node` field)
 * await getNode('local')
 *
 * // Download Node.js version from a specific file like `.nvmrc` or `package.json`
 * await getNode('/path/to/.nvmrc')
 *
 * // Specify the output directory
 * const { path } = await getNode('8', {
 *   output: '/home/user/.cache/node_releases/',
 * })
 * console.log(path) // /home/user/.cache/node_releases/13.0.1/node
 *
 * // Use a mirror website
 * await getNode('8', { mirror: 'https://npmmirror.com/mirrors/node' })
 *
 * // Specify the CPU architecture
 * await getNode('8', { arch: 'x32' })
 * ```
 */
export default function getNode(
  /**
   * Can be:
   *  - any [version range](https://github.com/npm/node-semver) such as `12`,
   *    `12.6.0` or `<12`
   *  - `latest`: Latest available Node version
   *  - `lts`: Latest LTS Node version
   *  - `global`: Global Node version
   *    - Using the home directory
   *      [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) or
   *      [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *    - [Some similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   *      used by other Node.js version managers are also searched for
   *    - If nothing is found, defaults to the current process's Node version
   *  - `local`: Current directory's Node version
   *    - Using the current directory or parent directories
   *      [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
   *      [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *      or
   *      [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   *    - Defaults to the `global` version
   *  - a file path towards a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
   *    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *    or
   *    [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   */
  versionRange: string,

  options?: Options,
): Promise<NodeBinary>
