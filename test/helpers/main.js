import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'
import { execFile } from 'child_process'

import { getBinPath } from 'get-bin-path'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)
const pExecFile = promisify(execFile)

export const TEST_VERSION = '6.0.0'

export const getOutputDir = function() {
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

export const getNodeCli = async function(versionRange, outputDir) {
  const binPath = await getBinPath()
  await pExecFile(binPath, [versionRange, outputDir])
}
