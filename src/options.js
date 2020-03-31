import { promises as fs } from 'fs'
import { cwd as getCwd, arch } from 'process'

import filterObj from 'filter-obj'
import findUp from 'find-up'
import { validate } from 'jest-validate'
import { validRange } from 'semver'

import { addOutput } from './output.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function (opts) {
  const optsA = await resolveNvmrcIfNeeded(opts)

  validate(optsA, { exampleConfig: EXAMPLE_OPTS })

  const optsB = filterObj(optsA, isDefined)
  const optsC = { ...DEFAULT_OPTS, ...optsB }

  const optsD = await addOutput(optsC)

  validateVersionRange(optsD)
  return optsD
}

const isDefined = function (key, value) {
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

const validateVersionRange = function ({ versionRange }) {
  if (validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }
}

const resolveNvmrcIfNeeded = async (opts) => {
  if (opts.versionRange !== 'nvmrc') return opts

  const { cwd, ...restOpts } = opts
  const nvmrcFile = await findUp('.nvmrc', { cwd })
  // default without undefined is process current directory
  if (!nvmrcFile) throw new Error('.nvmrc file not found')

  const nvmrcContent = await fs.readFile(nvmrcFile)
  return { ...restOpts, versionRange: nvmrcContent.toString().trim() }
}
