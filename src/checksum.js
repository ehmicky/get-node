import { createHash } from 'crypto'

import fetchNodeWebsite from 'fetch-node-website'
import getStream from 'get-stream'

// Verify Node.js binary checksum.
// Checksums are available for every Node.js release.
export const checkChecksum = async function(version, filepath, response) {
  try {
    const [expectedChecksum, actualChecksum] = await Promise.all([
      getExpectedChecksum(version, filepath),
      getActualChecksum(response),
    ])

    // This should only happen during a network error
    // eslint-disable-next-line max-depth
    if (actualChecksum !== expectedChecksum) {
      return `Could not download Node.js ${version}: checksum did not match`
    }
    // This should only happen during a network error
  } catch (error) {
    return `Could not download Node.js ${version} checksum: ${error.message}`
  }
}

// Retrieve expected checksum for this Node.js binary
const getExpectedChecksum = async function(version, filepath) {
  const response = await fetchNodeWebsite(`v${version}/SHASUMS256.txt`)
  const rawChecksums = await getStream(response)
  const [expectedChecksum] = rawChecksums
    .split('\n')
    .map(parseRawChecksum)
    .find(([, expectedFilepath]) => expectedFilepath === filepath)
  return expectedChecksum
}

const parseRawChecksum = function(rawChecksum) {
  return rawChecksum.trim().split(RAW_CHECKSUM_DELIMITER)
}

const RAW_CHECKSUM_DELIMITER = /\s+/u

// Calculate actual checksum for this Node.js binary
const getActualChecksum = async function(response) {
  const hashStream = response.pipe(createHash('sha256', { encoding: 'hex' }))
  const actualChecksum = await getStream(hashStream)
  return actualChecksum
}
