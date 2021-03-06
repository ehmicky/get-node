import { cpus } from 'os'
import { platform } from 'process'
import { pipeline } from 'stream'
import { promisify } from 'util'

import execa from 'execa'
import moize from 'moize'
import semver from 'semver'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'

import { untar, moveTar } from './tar.js'

// TODO: replace with `stream/promises` once dropping support for Node <15.0.0
const pPipeline = promisify(pipeline)

// Node provides with .tar.xz that are twice smaller. We try to use those.
// Those are not available for AIX nor 0.*.* versions.
// All existing xz/LZMA libraries require native modules, so we use the `xz`
// binary instead, when available.
export const shouldUseXz = function (version) {
  return versionHasXz(version) && platform !== 'aix' && hasXzBinary()
}

// Older Node.js versions only shipped .tar.gz not .tar.xz
const versionHasXz = function (version) {
  return semver.satisfies(version, XZ_VERSION_RANGE)
}

const XZ_VERSION_RANGE = '^0.10.42 || >=0.12.10'

const mHasXzBinary = async function () {
  const { failed } = await execa.command('xz --version', {
    reject: false,
    stdio: 'ignore',
  })
  return !failed
}

const hasXzBinary = moize(mHasXzBinary, { maxSize: 1e3 })

export const downloadXz = async function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.xz`,
    fetchOpts,
  )
  const { stdout, cancel } = execa.command(
    `xz --decompress --stdout --threads=${cpus().length}`,
    {
      input: response,
      stdout: 'pipe',
      stderr: 'ignore',
      buffer: false,
    },
  )
  const promise = pPipeline(stdout, untar(tmpFile))

  try {
    await promiseOrFetchError(promise, response)
  } finally {
    cancel()
  }

  await moveTar(tmpFile)

  return checksumError
}
