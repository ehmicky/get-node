import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve, join } from 'path'
import { platform } from 'process'

import { TEST_VERSION } from './versions.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)
const pSetTimeout = promisify(setTimeout)

export const getOutput = function() {
  const id = String(Math.random()).replace('.', '')
  return `${tmpdir()}/test-get-node-${id}`
}

export const removeOutput = async function(nodePath) {
  await pSetTimeout(REMOVE_TIMEOUT)
  await pUnlink(nodePath)
  await removeOutputDir(nodePath)
}

// We need to wait a little for Windows to release the lock on the `node`
// executable before cleaning it
const REMOVE_TIMEOUT = 1e3

export const removeOutputDir = async function(nodePath) {
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
}

export const getNodePath = function(versionRange, output) {
  const nodeFilename = platform === 'win32' ? 'node.exe' : 'node'
  const nodePath = join(output, TEST_VERSION, nodeFilename)
  return nodePath
}
