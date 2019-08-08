import { platform, arch } from 'process'
import { createGunzip } from 'zlib'
import { promisify } from 'util'

import { extract as tarExtract } from 'tar-fs'
import endOfStream from 'end-of-stream'

import { fetchUrl, URL_BASE } from './fetch.js'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Unix Node binary comes in a tar.gz folder
export const downloadUnixNode = async function(version, outputDir) {
  const { body } = await fetchUrl(
    `${URL_BASE}/v${version}/node-v${version}-${platform}-${arch}.tar.gz`,
  )

  const archive = body.pipe(createGunzip())

  await unarchive(archive, outputDir)
}

const unarchive = async function(archive, outputDir) {
  const extract = tarExtract(outputDir, { ignore: shouldExclude, strip: 2 })
  archive.pipe(extract)
  await pEndOfStream(extract)
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith('/node')
}
