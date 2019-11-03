import { platform, arch } from 'process'
import { createGunzip } from 'zlib'
import { promisify } from 'util'
import { rename, rmdir } from 'fs'
import { cpus } from 'os'

import { extract as tarExtract } from 'tar-fs'
import endOfStream from 'end-of-stream'
import fetchNodeWebsite from 'fetch-node-website'
import pEvent from 'p-event'
import execa from 'execa'
// eslint-disable-next-line import/max-dependencies
import moize from 'moize'

const pRename = promisify(rename)
const pRmdir = promisify(rmdir)

// TODO: replace with Stream.finished() after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

// The Unix Node binary comes in a .tar.gz or .tar.xz archive.
export const downloadUnixNode = async function(version, tmpFile, opts) {
  const { response, archive } = await downloadArchive(version, opts)

  // Rejects either on `archive` `error` or on `response` `error`
  // TODO: use `require('events').once()` after dropping support for Node 8/9
  await Promise.race([unarchive(archive, tmpFile), pEvent(response, [])])

  await moveFile(tmpFile)
}

const downloadArchive = async function(version, opts) {
  if (await shouldUseXz(version)) {
    return downloadXz(version, opts)
  }

  return downloadGz(version, opts)
}

// Node provides with .tar.xz that are twice smaller. We try to use those.
// Those are not available for AIX nor 0.*.* versions.
// All existing xz/LZMA libraries require native modules, so we use the `xz`
// binary instead, when available.
const shouldUseXz = function(version) {
  return !version.startsWith('0.') && platform !== 'aix' && hasXz()
}

const mHasXz = async function() {
  const { failed } = await execa.command('xz --version', { reject: false })
  return !failed
}

const hasXz = moize(mHasXz)

const downloadXz = async function(version, opts) {
  const response = await fetchNodeWebsite(
    `v${version}/node-v${version}-${platform}-${arch}.tar.xz`,
    opts,
  )
  const { stdout: archive } = execa.command(
    `xz --decompress --stdout --threads=${cpus().length}`,
    { input: response, stdout: 'pipe', stderr: 'ignore', buffer: false },
  )
  return { response, archive }
}

const downloadGz = async function(version, opts) {
  const response = await fetchNodeWebsite(
    `v${version}/node-v${version}-${platform}-${arch}.tar.gz`,
    opts,
  )
  const archive = response.pipe(createGunzip())
  return { response, archive }
}

const unarchive = async function(archive, tmpFile) {
  const extract = tarExtract(tmpFile, { ignore: shouldExclude, strip: 2 })
  archive.pipe(extract)
  await pEndOfStream(extract)
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith('/node')
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
