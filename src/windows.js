import { arch } from 'process'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

import endOfStream from 'end-of-stream'

import { fetchUrl, URL_BASE } from './fetch.js'

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Windows Node binary comes as a regular file
export const downloadWindowsNode = async function(version, tmpFile) {
  const { body } = await fetchUrl(
    `${URL_BASE}/v${version}/win-${arch}/node.exe`,
  )

  const writeStream = createWriteStream(tmpFile, { mode: NODE_MODE })
  body.pipe(writeStream)
  await pEndOfStream(writeStream)
}

const NODE_MODE = 0o755
