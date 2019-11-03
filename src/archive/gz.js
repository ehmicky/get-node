import { platform, arch } from 'process'
import { createGunzip } from 'zlib'

import fetchNodeWebsite from 'fetch-node-website'

// Downloads .tar.gz archive and extract it
export const downloadGz = async function(version, opts) {
  const response = await fetchNodeWebsite(
    `v${version}/node-v${version}-${platform}-${arch}.tar.gz`,
    opts,
  )
  const archive = response.pipe(createGunzip())
  return { response, archive }
}
