import { version as processVersion } from 'process'

import nodeVersionAlias from 'node-version-alias'
import preferredNodeVersion from 'preferred-node-version'
import { lt as ltVersion } from 'semver'

import { download } from './download.js'
import { getOpts } from './options.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async function (versionRange, opts) {
  const {
    versionRange: versionRangeA,
    output,
    arch,
    preferredNodeOpts,
    nodeVersionAliasOpts,
    fetchOpts,
  } = await getOpts({ ...opts, versionRange })

  const version = await getVersion({
    versionRange: versionRangeA,
    preferredNodeOpts,
    nodeVersionAliasOpts,
  })
  checkVersion(version)

  const nodePath = await download({ version, output, arch, fetchOpts })
  return { version, path: nodePath }
}

const getVersion = async function ({
  versionRange,
  preferredNodeOpts,
  nodeVersionAliasOpts,
}) {
  if (versionRange !== 'now') {
    return nodeVersionAlias(versionRange, nodeVersionAliasOpts)
  }

  const { version } = await preferredNodeVersion(preferredNodeOpts)

  if (version === undefined) {
    return processVersion.replace('v', '')
  }

  return version
}

// Node <0.8.6 only shipped source code for Unix. We don't want to support
// building from sources, so we can't support those very old versions.
const checkVersion = function (version) {
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
