import { cwd } from 'process'

import { validRange } from 'semver'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const normalizeInput = function(versionRange = '*', outputDir = cwd()) {
  validateInput(versionRange, outputDir)
  return [versionRange, outputDir]
}

const validateInput = function(versionRange, outputDir) {
  if (typeof versionRange !== 'string' || validRange(versionRange) === null) {
    throw new TypeError(`Not a valid Node version range: ${versionRange}`)
  }

  if (typeof outputDir !== 'string') {
    throw new TypeError(`Output directory should be a string: ${outputDir}`)
  }
}
