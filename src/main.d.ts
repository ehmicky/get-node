export type NodeBinary = {
  /**
   * Absolute path to the `node` executable
   */
  path: string
  /**
   * Normalized Node.js version
   */
  version: string
}

/**
 * Download a specific version of Node.js.
 * The Node.js release is downloaded, uncompressed and untared to an executable
 * file ready to run.
 */
export default function getNode(
  /**
   * Any Node.js version range such as `12`, `12.6.0` or `<12`, or one of the
   * following aliases: `latest`, `lts`, `global` or `local`.
   */
  versionRange: string,
  options?: {
    /**
     * Output directory for the `node` executable.
     * It the directory already has a `node` executable, no download is
     * performed. This enables caching.
     *
     * @default Global cache directory such as `/home/user/.cache/nve/`
     */
    output?: string
    /**
     * Whether to show a progress bar.
     *
     * @default false
     */
    progress?: boolean
    /**
     * Base URL to retrieve Node.js binaries.
     * Can be customized (for example `https://npmmirror.com/mirrors/node`).
     * The following environment variables can also be used: `NODE_MIRROR`,
     * `NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.
     *
     * @default "https://nodejs.org/dist"
     */
    mirror?: string
    /**
     * The list of available Node.js versions is cached for one hour by default.
     * If the `fetch` option is:
     *  - `true`: the cache will not be used
     *  - `false`: the cache will be used even if it's older than one hour
     *
     * @default undefined
     */
    fetch?: boolean
    /**
     * Node.js binary's CPU architecture. This is useful for example when you're
     * on x64 but would like to run Node.js x32.
     * All the values from `process.arch` are allowed except `mips` and `mipsel`
     *
     * @default `process.arch`
     */
    arch?: string
    /**
     * When using the `local` alias, start looking for a Node.js version file
     * from this directory.
     *
     * @default "."
     */
    cwd?: string | URL
  },
): Promise<NodeBinary>
