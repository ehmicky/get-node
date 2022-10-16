import { arch as processArch } from 'process'

import isPlainObj from 'is-plain-obj'

import { validateArch } from './arch.js'
import { getDefaultOutput, validateOutput } from './output.js'
import { DEFAULT_VERSION_RANGE, validateVersionRange } from './version.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async function (
  versionRange = DEFAULT_VERSION_RANGE,
  opts = {},
) {
  validateVersionRange(versionRange)

  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const {
    output = await getDefaultOutput(),
    arch = processArch,
    cwd,
    fetch: fetchOpt,
    mirror,
    progress = false,
  } = opts

  validateOutput(output)
  validateArch(arch)

  const preferredNodeOpts = { cwd, fetch: fetchOpt, mirror }
  const nodeVersionAliasOpts = { fetch: fetchOpt, mirror }
  const fetchOpts = { mirror, progress }
  return {
    versionRange,
    output,
    arch,
    preferredNodeOpts,
    nodeVersionAliasOpts,
    fetchOpts,
  }
}
