import { createWriteStream } from 'fs'
import { promisify } from 'util'

import endOfStream from 'end-of-stream'
import pEvent from 'p-event'

import { shouldUseZip, downloadZip } from './archive/zip.js'
import { downloadRaw } from './archive/raw.js'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Windows Node binary comes as a regular file or as a .zip file. We try
// to use the fastest method.
export const downloadWindowsNode = async function(version, tmpFile, opts) {
  const { response, checksumError } = await downloadFile(version, opts)

  const writeStream = createWriteStream(tmpFile, { mode: NODE_MODE })
  response.pipe(writeStream)

  // Rejects either on `writeStream` `error` or on `response` `error`
  // TODO: use `require('events').once()` after dropping support for Node 8/9
  await Promise.race([pEndOfStream(writeStream), pEvent(response, [])])

  return checksumError
}

const downloadFile = function(version, opts) {
  if (shouldUseZip(version)) {
    return downloadZip(version, opts)
  }

  return downloadRaw(version, opts)
}

const NODE_MODE = 0o755
