import { omitBy } from '../utils.js'

export const parseOpts = function(yargs) {
  const {
    _: [versionRange, output],
    ...opts
  } = yargs.parse()
  const versionRangeA = parseVersionRange(versionRange)
  const optsA = omitBy(opts, isInternalKey)
  return { ...optsA, versionRange: versionRangeA, output }
}

// `yargs` parses major releases (e.g. `8`) as numbers
const parseVersionRange = function(versionRange) {
  if (!Number.isInteger(versionRange)) {
    return versionRange
  }

  return String(versionRange)
}

// Remove `yargs`-specific options, shortcuts and dash-cased
const isInternalKey = function(key, value) {
  return (
    value === undefined ||
    INTERNAL_KEYS.includes(key) ||
    key.length === 1 ||
    key.includes('-')
  )
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']
