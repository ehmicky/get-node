import { platform, arch } from 'process'
import { createGunzip } from 'zlib'
import { promisify } from 'util'
import { rename, rmdir } from 'fs'

import { extract as tarExtract } from 'tar-fs'
import endOfStream from 'end-of-stream'
import fetchNodeWebsite from 'fetch-node-website'

const pRename = promisify(rename)
const pRmdir = promisify(rmdir)

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Unix Node binary comes in a tar.gz folder
export const downloadUnixNode = async function(version, tmpFile) {
  const { body } = await fetchNodeWebsite(
    `v${version}/node-v${version}-${platform}-${arch}.tar.gz`,
  )

  const archive = body.pipe(createGunzip())

  await unarchive(archive, tmpFile)

  await moveFile(tmpFile)
}

const unarchive = async function(archive, tmpFile) {
  const extract = tarExtract(tmpFile, { ignore: shouldExclude, strip: 2 })
  archive.pipe(extract)
  await pEndOfStream(extract)
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith('/node')
}

// The archive is extracted to a temporary directory with a single file in it.
// That directory should be cleaned up after moving the single file, so we
// remove it right away.
const moveFile = async function(tmpFile) {
  const intermediateFile = `${tmpFile}-${Math.random()}`
  await pRename(`${tmpFile}/node`, intermediateFile)
  await pRmdir(tmpFile)
  await pRename(intermediateFile, tmpFile)
}
