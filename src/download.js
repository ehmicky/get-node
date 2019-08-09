import { platform } from 'process'
import { promisify } from 'util'
import { rename } from 'fs'

import pathExists from 'path-exists'
// TODO: replace with `util.promisify(fs.mkdir)(path, { recursive: true })`
// after dropping support for Node 8/9
import makeDir from 'make-dir'
import { tmpName } from 'tmp-promise'

import { downloadWindowsNode } from './windows.js'
import { downloadUnixNode } from './unix.js'

const pRename = promisify(rename)

// Download the Node.js binary for a specific `version`.
// If the file already exists, do nothing. This allows caching.
export const download = async function(version, outputDir) {
  const outputDirA = `${outputDir}/${version}`
  const nodePath = `${outputDirA}/${NODE_FILENAME}`

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await safeDownload(version, outputDirA, nodePath)

  return nodePath
}

const NODE_FILENAME = platform === 'win32' ? 'node.exe' : 'node'

// Downloading the file should be atomic, so we don't leave partially written
// corrupted file executables. We cannot use libraries like `write-file-atomic`
// because they don't support streams. We download to a temporary directory
// first then move the file once download has completed.
const safeDownload = async function(version, outputDir, nodePath) {
  const tmpFile = await tmpName({ prefix: `get-node-${version}` })

  await downloadRuntime(version, tmpFile)

  await createOutputDir(outputDir)
  await pRename(tmpFile, nodePath)
}

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
const downloadRuntime = function(version, tmpFile) {
  if (platform === 'win32') {
    return downloadWindowsNode(version, tmpFile)
  }

  return downloadUnixNode(version, tmpFile)
}

const createOutputDir = async function(outputDir) {
  if (await pathExists(outputDir)) {
    return
  }

  await makeDir(outputDir)
}
