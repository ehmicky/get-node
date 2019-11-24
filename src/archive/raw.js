import { arch } from 'process'

import { gte as gteVersion } from 'semver'

import { fetchNodeUrl } from '../fetch.js'

// On Windows, when no zip archive is available (old Node.js versions), download
// the raw `node.exe` file available for download instead.
export const downloadRaw = async function(version, opts) {
  const filepath = getFilepath(version)
  const { response, checksumError } = await fetchNodeUrl(
    version,
    filepath,
    opts,
  )
  return { response, checksumError }
}

// Before Node.js 4.0.0, the URL to the node.exe was different
const getFilepath = function(version) {
  if (gteVersion(version, NEW_URL_VERSION)) {
    return `win-${arch}/node.exe`
  }

  // We currently only run CI tests on Windows x64
  // istanbul ignore else
  if (arch === 'x64') {
    return 'x64/node.exe'
  }

  // istanbul ignore next
  return 'node.exe'
}

const NEW_URL_VERSION = '4.0.0'
