import { download } from './download.js'
import { getOpts } from './options.js'
import { getVersion } from './version.js'

// Download the Node.js binary for a specific `versionRange`
// eslint-disable-next-line import/no-default-export
export default async function getNode(versionRange, opts) {
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
