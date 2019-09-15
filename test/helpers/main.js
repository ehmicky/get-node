import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve, join } from 'path'
import { platform } from 'process'

import { getBinPath } from 'get-bin-path'
import execa from 'execa'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

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

export const getNodeCli = async function(
  versionRange,
  { output = '', mirror } = {},
) {
  const binPath = await getBinPath()
  const options = mirror === undefined ? '' : `--mirror=${mirror}`
  const { stdout: path } = await execa.command(
    `node ${binPath} ${options} ${versionRange} ${output}`,
  )
  const [, version] = PATH_TO_VERSION_REGEXP.exec(path)
  return { path, version }
}

const PATH_TO_VERSION_REGEXP = /([\d.]+)[/\\][^/\\]+$/u

export const getNodePath = function(versionRange, output) {
  const nodeFilename = platform === 'win32' ? 'node.exe' : 'node'
  const nodePath = join(output, TEST_VERSION, nodeFilename)
  return nodePath
}
