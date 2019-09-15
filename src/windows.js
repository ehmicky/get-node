import { arch } from 'process'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

import endOfStream from 'end-of-stream'
import fetchNodeWebsite from 'fetch-node-website'
import pEvent from 'p-event'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Windows Node binary comes as a regular file
export const downloadWindowsNode = async function(version, tmpFile, opts) {
  const response = await fetchNodeWebsite(
    `v${version}/win-${arch}/node.exe`,
    opts,
  )

  const writeStream = createWriteStream(tmpFile, { mode: NODE_MODE })
  response.pipe(writeStream)

  // Rejects either on `writeStream` `error` or on `response` `error`
  await Promise.race([pEndOfStream(writeStream), pEvent(response, [])])
}

const NODE_MODE = 0o755
