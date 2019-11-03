import { promisify } from 'util'

import { extract as tarExtract } from 'tar-fs'
import endOfStream from 'end-of-stream'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// Extract .tar.gz and .tar.xz archive
export const untar = async function(archive, tmpFile) {
  const extract = tarExtract(tmpFile, { ignore: shouldExclude, strip: 2 })
  archive.pipe(extract)
  await pEndOfStream(extract)
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith('/node')
}
