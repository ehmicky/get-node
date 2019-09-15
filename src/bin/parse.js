import { omitBy } from '../utils.js'

export const parseOpts = function(yargs) {
  const {
    _: [versionRange, output],
    ...opts
  } = yargs.parse()
  const versionRangeA = String(versionRange)
  const optsA = omitBy(opts, isInternalKey)
  return { ...optsA, versionRange: versionRangeA, output }
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
