import normalizeNodeVersion from 'normalize-node-version'

import { getOpts } from './options.js'
import { download } from './download.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async function(versionRange, opts) {
  const { versionRange: versionRangeA, output, ...optsA } = await getOpts({
    ...opts,
    versionRange,
  })

  const version = await normalizeNodeVersion(versionRangeA, {
    ...optsA,
    cache: true,
  })

  const nodePath = await download(version, output, optsA)
  return { version, path: nodePath }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = getNode
