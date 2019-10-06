import { cwd as getCwd } from 'process'

import globalCacheDir from 'global-cache-dir'
import { validRange } from 'semver'
import { validate } from 'jest-validate'
import filterObj from 'filter-obj'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function(opts) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const output = await globalCacheDir(CACHE_DIR)
  const optsA = filterObj(opts, isDefined)
  const optsB = { ...DEFAULT_OPTS, output, ...optsA }

  validateVersionRange(optsB)

  return optsB
}

const isDefined = function(key, value) {
  return value !== undefined
}

const CACHE_DIR = 'nve'

const DEFAULT_OPTS = {
  versionRange: '*',
  progress: false,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  output: getCwd(),
  versionRange: '8',
  mirror: 'https://nodejs.org/dist',
}

const validateVersionRange = function({ versionRange }) {
  if (validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}
