import { createWriteStream } from 'fs'

import fetchNodeWebsite from 'fetch-node-website'
import pEvent from 'p-event'

import { checkChecksum } from './checksum.js'

// Make HTTP request to retrieve a Node.js binary.
// Also make another HTTP request to calculate the checksum.
export const fetchNodeUrl = async function(version, filepath, opts) {
  const response = await fetchNodeWebsite(`v${version}/${filepath}`, opts)
  const checksumError = checkChecksum(version, filepath, response)
  return { response, checksumError }
}

// `response` `error` events do not necessarily make piped streams error, so we
// need to await either.
export const promiseOrFetchError = async function(promise, response) {
  // TODO: use `require('events').once()` after dropping support for Node 8/9
  await Promise.race([promise, pEvent(response, [])])
}

// Persist stream to a `node[.exe]` file
export const writeNodeBinary = function(tmpFile) {
  return createWriteStream(tmpFile, { mode: NODE_MODE })
}

const NODE_MODE = 0o755
