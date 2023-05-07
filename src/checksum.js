import { createHash } from 'node:crypto'
import { env } from 'node:process'
import { text } from 'node:stream/consumers'

import fetchNodeWebsite from 'fetch-node-website'

// Verify Node.js binary checksum.
// Checksums are available for every Node.js release.
// This never throws, which allows it not to be awaited right away.
export const checkChecksum = async ({
  version,
  filepath,
  response,
  fetchOpts,
}) => {
  try {
    const [expectedChecksum, actualChecksum] = await Promise.all([
      getExpectedChecksum(version, filepath, fetchOpts),
      getActualChecksum(response),
    ])

    // This should only happen during a network error
    // eslint-disable-next-line max-depth
    if (actualChecksum !== expectedChecksum) {
      return `Could not download Node.js ${version}: checksum did not match`
    }
    // This should only happen during a network error, or when using an
    // unsupported platform or CPU architecture
  } catch (error) {
    return `Could not download Node.js ${version} checksum: ${error.message}`
  }
}

// Retrieve expected checksum for this Node.js binary
// Checksums are delivered as a newline separated list like this:
//   3ca24...23380  node-v6.12.3-aix-ppc64.tar.gz
//   4e731...4278f  node-v6.12.3-darwin-x64.tar.gz
//   etc.
const getExpectedChecksum = async (version, filepath, fetchOpts) => {
  const checksumLines = await getChecksumLines(version, fetchOpts)
  const [expectedChecksum] = checksumLines
    .split('\n')
    .map(parseChecksumLine)
    .find(([, expectedFilepath]) => expectedFilepath === filepath)
  return expectedChecksum
}

const getChecksumLines = async (version, fetchOpts) => {
  // We set this environment variable during tests. Otherwise there are no ways
  // to test checksums since they are always supposed to match unlike there is
  // a network error
  if (env.TEST_CHECKSUMS !== undefined) {
    return env.TEST_CHECKSUMS
  }

  const response = await fetchNodeWebsite(`v${version}/SHASUMS256.txt`, {
    ...fetchOpts,
    progress: false,
  })
  const checksumLines = await text(response)
  return checksumLines
}

const parseChecksumLine = (checksumLine) =>
  checksumLine.trim().split(CHECKSUM_LINE_DELIMITER)

const CHECKSUM_LINE_DELIMITER = /\s+/u

// Calculate actual checksum for this Node.js binary
const getActualChecksum = async (response) => {
  const hashStream = response.pipe(createHash('sha256', { encoding: 'hex' }))
  const actualChecksum = await text(hashStream)
  return actualChecksum
}
