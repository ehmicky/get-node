import { arch } from 'process'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

import endOfStream from 'end-of-stream'
import pEvent from 'p-event'
import { gte as gteVersion } from 'semver'

import { fetchNodeUrl } from './fetch.js'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Windows Node binary comes as a regular file
// Node provides with .7z that are much smaller. However we don't use those
// because of the lack of Node.js 7z/LZMA libraries that support streaming and
// do not use native modules.
export const downloadWindowsNode = async function(version, tmpFile, opts) {
  const filepath = getFilepath(version)
  const { response, checksumError } = await fetchNodeUrl(
    version,
    filepath,
    opts,
  )

  const writeStream = createWriteStream(tmpFile, { mode: NODE_MODE })
  response.pipe(writeStream)

  // Rejects either on `writeStream` `error` or on `response` `error`
  // TODO: use `require('events').once()` after dropping support for Node 8/9
  await Promise.race([pEndOfStream(writeStream), pEvent(response, [])])

  return checksumError
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

const NODE_MODE = 0o755
