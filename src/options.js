import { arch as processArch } from 'node:process'

import isPlainObj from 'is-plain-obj'

import { validateArch } from './arch.js'
import { getDefaultOutput, validateOutput } from './output.js'
import { DEFAULT_VERSION_RANGE, validateVersionRange } from './version.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = async (
  versionRange = DEFAULT_VERSION_RANGE,
  opts = {},
) => {
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
    signal,
  } = opts

  validateOutput(output)
  validateArch(arch)

  const preferredNodeOpts = { cwd, fetch: fetchOpt, mirror, signal }
  const nodeVersionAliasOpts = { fetch: fetchOpt, mirror, signal }
  const fetchOpts = { mirror, progress, signal }
  return {
    versionRange,
    output,
    arch,
    preferredNodeOpts,
    nodeVersionAliasOpts,
    fetchOpts,
  }
}
