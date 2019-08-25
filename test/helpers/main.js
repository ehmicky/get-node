import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve, join } from 'path'
import { execFile } from 'child_process'
import { platform } from 'process'

import { getBinPath } from 'get-bin-path'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)
const pExecFile = promisify(execFile)

export const TEST_VERSION = '6.0.0'

export const getOutput = function() {
  const id = String(Math.random()).replace('.', '')
  return `${tmpdir()}/test-get-node-${id}`
}

export const removeOutput = async function(nodePath) {
  await pUnlink(nodePath)
  await removeOutputDir(nodePath)
}

export const removeOutputDir = async function(nodePath) {
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
}

export const getNodeCli = async function(versionRange, { output = '' } = {}) {
  const binPath = await getBinPath()
  const returnValue = await pExecFile('node', [binPath, versionRange, output])
  const path = returnValue.stdout.trim()
  const [, version] = PATH_TO_VERSION_REGEXP.exec(path)
  return { path, version }
}

const PATH_TO_VERSION_REGEXP = /([\d.]+)\/[^/]+$/u

export const getNodePath = function(versionRange, output) {
  const nodeFilename = platform === 'win32' ? 'node.exe' : 'node'
  const nodePath = join(output, TEST_VERSION, nodeFilename)
  return nodePath
}
