import normalizeNodeVersion from 'normalize-node-version'
import { lt as ltVersion } from 'semver'

import { getOpts } from './options.js'
import { download } from './download.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async function(versionRange, opts) {
  const {
    versionRange: versionRangeA,
    output,
    arch,
    ...optsA
  } = await getOpts({ ...opts, versionRange })

  const version = await normalizeNodeVersion(versionRangeA, {
    ...optsA,
    cache: true,
  })
  checkVersion(version)

  const nodePath = await download({ version, output, arch, opts: optsA })
  return { version, path: nodePath }
}

// Node <0.8.6 only shipped source code for Unix. We don't want to support
// building from sources, so we can't support those very old versions.
const checkVersion = function(version) {
  if (ltVersion(version, MINIMUM_VERSION)) {
    throw new Error(
      `Unsupported Node.js version: ${version}. Must be >= 0.8.6.`,
    )
  }
}

const MINIMUM_VERSION = '0.8.6'

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = getNode
