import { promisify } from 'util'
import { rename, rmdir } from 'fs'

import pEvent from 'p-event'
import pFinally from 'p-finally'

import { shouldUseXz, downloadXz } from './archive/xz.js'
import { downloadGz } from './archive/gz.js'
import { untar } from './archive/tar.js'

const pRename = promisify(rename)
const pRmdir = promisify(rmdir)

// The Unix Node binary comes in a .tar.gz or .tar.xz archive.
export const downloadUnixNode = async function(version, tmpFile, opts) {
  const { response, archive, cancel } = await downloadArchive(version, opts)

  const promise = untar(archive, tmpFile)
  await handleError(promise, response, cancel)

  await moveFile(tmpFile)
}

const downloadArchive = async function(version, opts) {
  if (await shouldUseXz(version)) {
    return downloadXz(version, opts)
  }

  return downloadGz(version, opts)
}

// Rejects either on `archive` `error` or on `response` `error`
const handleError = function(promise, response, cancel) {
  // TODO: use `require('events').once()` after dropping support for Node 8/9
  const promiseA = Promise.race([promise, pEvent(response, [])])

  if (cancel === undefined) {
    return promiseA
  }

  // TODO: use `promise.finally()` after dropping support for Node 8/9
  return pFinally(promiseA, cancel)
}

// The archive is extracted to a temporary directory with a single file in it.
// That directory should be cleaned up after moving the single file, so we
// remove it right away.
const moveFile = async function(tmpFile) {
  const intermediateFile = `${tmpFile}-${Math.random()}`
  await pRename(`${tmpFile}/node`, intermediateFile)
  await pRmdir(tmpFile)
  await pRename(intermediateFile, tmpFile)
}
