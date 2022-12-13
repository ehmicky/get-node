import { download } from './download.js'
import { getOpts } from './options.js'
import { getVersion } from './version.js'

// Download the Node.js binary for a specific `versionRange`
const getNode = async (versionRange, opts) => {
  const {
    versionRange: versionRangeA,
    output,
    arch,
    preferredNodeOpts,
    nodeVersionAliasOpts,
    fetchOpts,
  } = await getOpts(versionRange, opts)
  const version = await getVersion({
    versionRange: versionRangeA,
    preferredNodeOpts,
    nodeVersionAliasOpts,
  })
  const nodePath = await download({ version, output, arch, fetchOpts })
  return { version, path: nodePath }
}

export default getNode
