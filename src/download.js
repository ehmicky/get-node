import { platform } from 'process'
import { join } from 'path'

import pathExists from 'path-exists'
import { tmpName } from 'tmp-promise'
import moveFile from 'move-file'

import { downloadWindowsNode } from './windows.js'
import { downloadUnixNode } from './unix.js'

// Download the Node.js binary for a specific `version`.
// If the file already exists, do nothing. This allows caching.
export const download = async function(version, outputDir, progress) {
  const nodePath = join(outputDir, version, NODE_FILENAME)

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await safeDownload(version, nodePath, progress)

  return nodePath
}

const NODE_FILENAME = platform === 'win32' ? 'node.exe' : 'node'

// Downloading the file should be atomic, so we don't leave partially written
// corrupted file executables. We cannot use libraries like `write-file-atomic`
// because they don't support streams. We download to the temporary directory
// first then move the file once download has completed.
// We use the temporary directory instead of creating a sibling file:
//  - this is to make sure if process is interrupted (e.g. with SIGINT), the
//    temporary file is cleaned up (without requiring libraries like
//    `signal-exit`)
//  - this means the file might be on a different partition
//    (https://github.com/ehmicky/get-node/issues/1), requiring copying it
//    instead of renaming it. This is done by the `move-file` library.
const safeDownload = async function(version, nodePath, progress) {
  const tmpFile = await tmpName({ prefix: `get-node-${version}` })

  await downloadRuntime(version, tmpFile, progress)

  await moveTmpFile(tmpFile, nodePath)
}

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
const downloadRuntime = function(version, tmpFile, progress) {
  if (platform === 'win32') {
    return downloadWindowsNode(version, tmpFile, progress)
  }

  return downloadUnixNode(version, tmpFile, progress)
}

const moveTmpFile = async function(tmpFile, nodePath) {
  // Another parallel download might have been running
  if (await pathExists(nodePath)) {
    return
  }

  await moveFile(tmpFile, nodePath)
}
