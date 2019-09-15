import { cwd as getCwd } from 'process'

import globalCacheDir from 'global-cache-dir'
import { validRange } from 'semver'
import { validate } from 'jest-validate'

import { omitBy } from './utils.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function(opts) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const output = await globalCacheDir(CACHE_DIR)
  const optsA = omitBy(opts, isUndefined)
  const optsB = { ...DEFAULT_OPTS, output, ...optsA }

  validateVersionRange(optsB)

  return optsB
}

const isUndefined = function(key, value) {
  return value === undefined
}

const CACHE_DIR = 'nve'

const DEFAULT_OPTS = {
  versionRange: '*',
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  output: getCwd(),
  versionRange: '8',
  progress: true,
  mirror: 'https://nodejs.org/dist',
}

const validateVersionRange = function({ versionRange }) {
  if (validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}
