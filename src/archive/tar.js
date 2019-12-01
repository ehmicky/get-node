import { promisify } from 'util'
import { rename, rmdir } from 'fs'

import { extract as tarExtract } from 'tar-fs'

const pRename = promisify(rename)
const pRmdir = promisify(rmdir)

// Extract .tar.gz and .tar.xz archive
export const untar = function(tmpFile) {
  return tarExtract(tmpFile, { ignore: shouldExclude, strip: 2 })
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith('/node')
}

// The archive is extracted to a temporary directory with a single file in it.
// That directory should be cleaned up after moving the single file, so we
// remove it right away.
export const moveTar = async function(tmpFile) {
  const intermediateFile = `${tmpFile}-${Math.random()}`
  await pRename(`${tmpFile}/node`, intermediateFile)
  await pRmdir(tmpFile)
  await pRename(intermediateFile, tmpFile)
}
