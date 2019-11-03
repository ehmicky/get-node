import { platform, arch } from 'process'
import { createGunzip } from 'zlib'

import { fetchNodeUrl } from '../fetch.js'

// Downloads .tar.gz archive and extract it
export const downloadGz = async function(version, opts) {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.gz`,
    opts,
  )
  const archive = response.pipe(createGunzip())
  return { response, checksumError, archive }
}
