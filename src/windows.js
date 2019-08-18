import { arch } from 'process'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

import endOfStream from 'end-of-stream'
import fetchNodeWebsite from 'fetch-node-website'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Windows Node binary comes as a regular file
export const downloadWindowsNode = async function(version, tmpFile, progress) {
  const { body } = await fetchNodeWebsite(`v${version}/win-${arch}/node.exe`, {
    progress,
  })

  const writeStream = createWriteStream(tmpFile, { mode: NODE_MODE })
  body.pipe(writeStream)
  await pEndOfStream(writeStream)
}

const NODE_MODE = 0o755
