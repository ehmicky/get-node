import { cwd as getCwd } from 'process'

import { validRange } from 'semver'
import { validate } from 'jest-validate'

import { omitBy } from './utils.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = function(opts = {}) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const optsA = omitBy(opts, isUndefined)
  const optsB = { ...DEFAULT_OPTS, ...optsA }

  validateVersionRange(optsB)

  return optsB
}

const isUndefined = function(key, value) {
  return value === undefined
}

const DEFAULT_OPTS = {
  output: getCwd(),
  progress: true,
  versionRange: '*',
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  versionRange: '8',
}

const validateVersionRange = function({ versionRange }) {
  if (validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}
