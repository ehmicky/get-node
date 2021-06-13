import { version as processVersion } from 'process'

import nodeVersionAlias from 'node-version-alias'
import preferredNodeVersion from 'preferred-node-version'
import semver from 'semver'

// Resolve full Node.js version.
// We resolve aliases like 'latest' or 'lts' using `node-version-alias`.
// The 'local' alias uses more complex logic using `preferred-node-version` and
// defaults to `process.version`.
export const getVersion = async function ({
  versionRange,
  preferredNodeOpts,
  nodeVersionAliasOpts,
}) {
  const version = await resolveVersion({
    versionRange,
    preferredNodeOpts,
    nodeVersionAliasOpts,
  })
  checkVersion(version)
  return version
}

const resolveVersion = function ({
  versionRange,
  preferredNodeOpts,
  nodeVersionAliasOpts,
}) {
  if (versionRange === 'global') {
    return getPreferredVersion({ ...preferredNodeOpts, global: true })
  }

  if (versionRange === 'local') {
    return getPreferredVersion(preferredNodeOpts)
  }

  return nodeVersionAlias(versionRange, nodeVersionAliasOpts)
}

const getPreferredVersion = async function (preferredNodeOpts) {
  const { version } = await preferredNodeVersion(preferredNodeOpts)

  if (version === undefined) {
    return processVersion.replace('v', '')
  }

  return version
}

// Node <0.8.6 only shipped source code for Unix. We don't want to support
// building from sources, so we can't support those very old versions.
const checkVersion = function (version) {
  if (semver.lt(version, MINIMUM_VERSION)) {
    throw new Error(
      `Unsupported Node.js version: ${version}. Must be >= ${MINIMUM_VERSION}.`,
    )
  }
}

const MINIMUM_VERSION = '0.8.6'
