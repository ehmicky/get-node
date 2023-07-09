import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname } from 'node:path'
import { platform } from 'node:process'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import getNode from 'get-node'

const FIXTURES_DIR_URL = new URL('../fixtures/', import.meta.url)
export const FIXTURES_DIR = fileURLToPath(FIXTURES_DIR_URL)

export const getNodeVersion = async (versionRange, opts) => {
  const output = getOutput()
  const { path, version } = await getNode(versionRange, { output, ...opts })
  const cleanup = removeOutput.bind(undefined, path)
  return { output, path, version, cleanup }
}

export const getOutput = () => {
  const id = String(Math.random()).replace('.', '')
  return `${tmpdir()}/test-get-node-${id}`
}

const removeOutput = async (nodePath) => {
  await setTimeout(REMOVE_TIMEOUT)

  const nodeDir = getNodeDir(nodePath)
  await rm(dirname(nodeDir), { force: true, recursive: true })
}

// We need to wait a little for Windows to release the lock on the `node`
// executable before cleaning it
const REMOVE_TIMEOUT = 1e3

export const getNodeDir = (nodePath) => {
  if (platform === 'win32') {
    return dirname(nodePath)
  }

  return dirname(dirname(nodePath))
}
