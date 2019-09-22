import { platform } from 'process'
import { join } from 'path'

import pathExists from 'path-exists'
import { tmpName } from 'tmp-promise'
import moveFile from 'move-file'

import { downloadWindowsNode } from './windows.js'
import { downloadUnixNode } from './unix.js'

// Download the Node.js binary for a specific `version`.
// If the file already exists, do nothing. This allows caching.
export const download = async function(version, output, opts) {
  const nodePath = join(output, version, NODE_FILENAME)

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await safeDownload(version, nodePath, opts)

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
const safeDownload = async function(version, nodePath, opts) {
  const tmpFile = await tmpName({ prefix: `get-node-${version}` })

  try {
    await downloadRuntime(version, tmpFile, opts)
  } catch (error) {
    throw new Error(`Could not download Node.js ${version}: ${error.message}`)
  }

  await moveTmpFile(tmpFile, nodePath)
}

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
const downloadRuntime = function(version, tmpFile, opts) {
  if (platform === 'win32') {
    return downloadWindowsNode(version, tmpFile, opts)
  }

  return downloadUnixNode(version, tmpFile, opts)
}

const moveTmpFile = async function(tmpFile, nodePath) {
  // Another parallel download might have been running
  if (await pathExists(nodePath)) {
    return
  }

  await moveFile(tmpFile, nodePath)
}
