import { satisfies } from 'semver'
import getStream from 'get-stream'
import { loadAsync } from 'jszip'

import { fetchNodeUrl } from '../fetch.js'
import { getArch } from '../arch.js'

// .zip Node binaries for Windows were added in Node 4.5.0 and 6.2.1
export const shouldUseZip = function(version) {
  return satisfies(version, ZIP_VERSION_RANGE)
}

const ZIP_VERSION_RANGE = '^4.5.0 || >=6.2.1'

// Download the Node binary .zip archive and return it as a stream
export const downloadZip = async function(version, opts) {
  const filepath = getZipFilepath(version)
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `${filepath}.zip`,
    opts,
  )
  const fileStream = await getFileStream(response, filepath)
  return { response: fileStream, checksumError }
}

const getZipFilepath = function(version) {
  const arch = getArch()
  return `node-v${version}-win-${arch}`
}

// `jszip` does not allow streaming with `loadAsync()` so we need to wait for
// the HTTP request to complete before starting unzipping.
// However we can stream the file unzipping with the file writing.
const getFileStream = async function(response, filepath) {
  const zipContent = await getStream.buffer(response)
  const archive = await loadAsync(zipContent, JSZIP_OPTIONS)
  const file = archive.file(`${filepath}/node.exe`)
  const fileStream = file.nodeStream('nodebuffer')
  return fileStream
}

const JSZIP_OPTIONS = { checkCRC32: true, createFolders: false }
