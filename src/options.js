import { cwd as getCwd, arch } from 'process'

import filterObj from 'filter-obj'
import { validate } from 'jest-validate'
import { validRange } from 'semver'

import { addOutput } from './output.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function (opts) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS })

  const optsA = filterObj(opts, isDefined)
  const optsB = { ...DEFAULT_OPTS, ...optsA }

  const optsC = await addOutput(optsB)

  validateVersionRange(optsC)

  const { cwd, fetch, mirror, progress, ...optsD } = optsC
  const preferredNodeOpts = { cwd, fetch, mirror }
  const nodeVersionAliasOpts = { fetch, mirror }
  const fetchOpts = { mirror, progress }
  return { ...optsD, preferredNodeOpts, nodeVersionAliasOpts, fetchOpts }
}

const isDefined = function (key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  versionRange: 'latest',
  progress: false,
  arch,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  output: getCwd(),
  versionRange: '8',
  // Passed to preferred-node-version
  cwd: getCwd(),
  // Passed to all-node-versions
  fetch: true,
  // Passed to fetch-node-website
  mirror: 'https://nodejs.org/dist',
}

const validateVersionRange = function ({ versionRange }) {
  if (!ALIASES.has(versionRange) && validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}

// Although `node-version-alias` supports more aliases, we only allow those ones
// to keep it simple
const ALIASES = new Set(['latest', 'local', 'lts'])
