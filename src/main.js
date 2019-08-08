import normalizeNodeVersion from 'normalize-node-version'

import { normalizeInput } from './input.js'
import { download } from './download.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async function(versionRange, outputDir) {
  const [versionRangeA, outputDirA] = normalizeInput(versionRange, outputDir)

  const version = await normalizeNodeVersion(versionRangeA)

  const nodePath = await download(version, outputDirA)
  return nodePath
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = getNode
