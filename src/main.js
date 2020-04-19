import { download } from './download.js'
import { getOpts } from './options.js'
import { getVersion } from './version.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async function (versionRange, opts) {
  const {
    versionRange: versionRangeA,
    output,
    arch,
    preferredNodeOpts,
    nodeVersionAliasOpts,
    fetchOpts,
  } = await getOpts({ ...opts, versionRange })

  const version = await getVersion({
    versionRange: versionRangeA,
    preferredNodeOpts,
    nodeVersionAliasOpts,
  })
  const nodePath = await download({ version, output, arch, fetchOpts })
  return { version, path: nodePath }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = getNode
