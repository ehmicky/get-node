import { createWriteStream } from 'fs'
// eslint-disable-next-line fp/no-events
import { once } from 'events'

import fetchNodeWebsite from 'fetch-node-website'

import { checkChecksum } from './checksum.js'

// Make HTTP request to retrieve a Node.js binary.
// Also make another HTTP request to calculate the checksum.
export const fetchNodeUrl = async function (version, filepath, opts) {
  const response = await fetchNodeWebsite(`v${version}/${filepath}`, opts)
  const checksumError = checkChecksum(version, filepath, response)
  return { response, checksumError }
}

// `response` `error` events do not necessarily make piped streams error, so we
// need to await either.
export const promiseOrFetchError = async function (promise, response) {
  await Promise.race([promise, throwOnFetchError(response)])
}

const throwOnFetchError = async function (response) {
  const [error] = await once(response, 'error')
  throw error
}

// Persist stream to a `node[.exe]` file
export const writeNodeBinary = function (tmpFile) {
  return createWriteStream(tmpFile, { mode: NODE_MODE })
}

const NODE_MODE = 0o755
