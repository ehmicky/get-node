import { promisify } from 'util'
import { pipeline } from 'stream'

import { satisfies } from 'semver'
import getStream from 'get-stream'
import { loadAsync } from 'jszip'

import { fetchNodeUrl, writeNodeBinary, promiseOrFetchError } from '../fetch.js'

const pPipeline = promisify(pipeline)

// .zip Node binaries for Windows were added in Node 4.5.0 and 6.2.1
export const shouldUseZip = function(version) {
  return satisfies(version, ZIP_VERSION_RANGE)
}

const ZIP_VERSION_RANGE = '^4.5.0 || >=6.2.1'

// Download the Node binary .zip archive and return it as a stream
// `jszip` does not allow streaming with `loadAsync()` so we need to wait for
// the HTTP request to complete before starting unzipping.
// However we can stream the file unzipping with the file writing.
export const downloadZip = async function({ version, tmpFile, arch, opts }) {
  const filepath = getZipFilepath(version, arch)
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `${filepath}.zip`,
    opts,
  )
  const zipContent = await getStream.buffer(response)
  const zipStream = await getZipStream(zipContent, filepath)
  const promise = pPipeline(zipStream, writeNodeBinary(tmpFile))

  await promiseOrFetchError(promise, response)

  return checksumError
}

const getZipFilepath = function(version, arch) {
  return `node-v${version}-win-${arch}`
}

const getZipStream = async function(zipContent, filepath) {
  const archive = await loadAsync(zipContent, JSZIP_OPTIONS)
  const file = archive.file(`${filepath}/node.exe`)
  const zipStream = file.nodeStream('nodebuffer')
  return zipStream
}

const JSZIP_OPTIONS = { checkCRC32: true, createFolders: false }
