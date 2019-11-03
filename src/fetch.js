import fetchNodeWebsite from 'fetch-node-website'

import { checkChecksum } from './checksum.js'

// Make HTTP request to retrieve a Node.js binary.
// Also make another HTTP request to calculate the checksum.
export const fetchNodeUrl = async function(version, filepath, opts) {
  const response = await fetchNodeWebsite(`v${version}/${filepath}`, opts)
  const checksumError = checkChecksum(version, filepath, response)
  return { response, checksumError }
}
