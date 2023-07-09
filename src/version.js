import { basename } from 'node:path'
import { version as processVersion } from 'node:process'

import nodeVersionAlias from 'node-version-alias'
import preferredNodeVersion, {
  NODE_VERSION_FILES,
} from 'preferred-node-version'
import semver from 'semver'

// Default value for `versionRange`
export const DEFAULT_VERSION_RANGE = 'latest'

// Validate `versionRange` argument
export const validateVersionRange = (versionRange) => {
  if (typeof versionRange !== 'string') {
    throw new TypeError(`Node version range must be a string: ${versionRange}`)
  }

  if (!isVersionRange(versionRange)) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}

const isVersionRange = (versionRange) =>
  ALIASES.has(versionRange) ||
  isVersionFile(versionRange) ||
  semver.validRange(versionRange) !== null

// Although `node-version-alias` supports more aliases, we only allow those ones
// to keep it simple
const ALIASES = new Set(['latest', 'lts', 'global', 'local'])

// Resolve full Node.js version.
// We resolve aliases like 'latest' or 'lts' using `node-version-alias`.
// The 'local' alias uses more complex logic using `preferred-node-version` and
// defaults to `process.version`.
export const getVersion = async ({
  versionRange,
  preferredNodeOpts,
  nodeVersionAliasOpts,
}) => {
  const version = await resolveVersion({
    versionRange,
    preferredNodeOpts,
    nodeVersionAliasOpts,
  })
  checkVersion(version)
  return version
}

const resolveVersion = ({
  versionRange,
  preferredNodeOpts,
  nodeVersionAliasOpts,
}) => {
  if (versionRange === 'global') {
    return getPreferredVersion({ ...preferredNodeOpts, global: true })
  }

  if (versionRange === 'local') {
    return getPreferredVersion(preferredNodeOpts)
  }

  if (isVersionFile(versionRange)) {
    return getPreferredVersion({ ...preferredNodeOpts, files: [versionRange] })
  }

  return nodeVersionAlias(versionRange, nodeVersionAliasOpts)
}

const isVersionFile = (versionRange) =>
  NODE_VERSION_FILES_SET.has(basename(versionRange))

const NODE_VERSION_FILES_SET = new Set(NODE_VERSION_FILES)

const getPreferredVersion = async (preferredNodeOpts) => {
  const { version } = await preferredNodeVersion(preferredNodeOpts)

  if (version === undefined) {
    return processVersion.replace('v', '')
  }

  return version
}

// Node <0.8.6 only shipped source code for Unix. We don't want to support
// building from sources, so we can't support those very old versions.
const checkVersion = (version) => {
  if (semver.lt(version, MINIMUM_VERSION)) {
    throw new Error(
      `Unsupported Node.js version: ${version}. Must be >= ${MINIMUM_VERSION}.`,
    )
  }
}

const MINIMUM_VERSION = '0.8.6'
