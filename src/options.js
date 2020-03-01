import { cwd as getCwd, arch } from 'process'

import { validRange } from 'semver'
import { validate } from 'jest-validate'
import filterObj from 'filter-obj'

import { addOutput } from './output.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function(opts) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const optsA = filterObj(opts, isDefined)
  const optsB = { ...DEFAULT_OPTS, ...optsA }

  const optsC = await addOutput(optsB)

  validateVersionRange(optsC)

  return optsC
}

const isDefined = function(key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  versionRange: '*',
  progress: false,
  arch,
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
