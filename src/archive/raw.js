import { pipeline } from 'stream'
import { promisify } from 'util'

import semver from 'semver'

import { fetchNodeUrl, promiseOrFetchError, writeNodeBinary } from '../fetch.js'

// TODO: replace with `stream/promises` once dropping support for Node <15.0.0
const pPipeline = promisify(pipeline)

// On Windows, when no zip archive is available (old Node.js versions), download
// the raw `node.exe` file available for download instead.
export const downloadRaw = async function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  const filepath = getFilepath(version, arch)
  const { response, checksumError } = await fetchNodeUrl(
    version,
    filepath,
    fetchOpts,
  )
  const promise = pPipeline(response, writeNodeBinary(tmpFile))

  await promiseOrFetchError(promise, response)

  return checksumError
}

// Before Node.js 4.0.0, the URL to the node.exe was different
const getFilepath = function (version, arch) {
  if (semver.gte(version, NEW_URL_VERSION)) {
    return `win-${arch}/node.exe`
  }

  /* c8 ignore start */
  // We currently only run CI tests on Windows x64
  if (arch === 'x64') {
    return 'x64/node.exe'
  }

  return 'node.exe'
  /* c8 ignore stop */
}

const NEW_URL_VERSION = '4.0.0'
