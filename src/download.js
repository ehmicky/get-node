import { platform } from 'process'

import pathExists from 'path-exists'
import cleanWrite from 'clean-write'
// TODO: replace with `util.promisify(fs.mkdir)(path, { recursive: true })`
// after dropping support for Node 8/9
import makeDir from 'make-dir'

import { downloadWindowsNode } from './windows.js'
import { downloadUnixNode } from './unix.js'

// Download the Node.js binary for a specific `version`.
// If the file already exists, do nothing. This allows caching.
export const download = async function(version, outputDir) {
  const outputDirA = `${outputDir}/${version}`
  const nodePath = `${outputDirA}/${NODE_FILENAME}`

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await createOutputDir(outputDirA)

  await cleanWrite(
    () => downloadRuntime(version, outputDirA, nodePath),
    nodePath,
  )

  return nodePath
}

const NODE_FILENAME = platform === 'win32' ? 'node.exe' : 'node'

const createOutputDir = async function(outputDir) {
  if (await pathExists(outputDir)) {
    return
  }

  await makeDir(outputDir)
}

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
const downloadRuntime = function(version, outputDir, nodePath) {
  if (platform === 'win32') {
    return downloadWindowsNode(version, nodePath)
  }

  return downloadUnixNode(version, outputDir)
}
