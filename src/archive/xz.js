import { platform } from 'process'
import { cpus } from 'os'
import { promisify } from 'util'
import { pipeline } from 'stream'

import execa from 'execa'
import moize from 'moize'
import { satisfies } from 'semver'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'

import { untar, moveTar } from './tar.js'

const pPipeline = promisify(pipeline)

// Node provides with .tar.xz that are twice smaller. We try to use those.
// Those are not available for AIX nor 0.*.* versions.
// All existing xz/LZMA libraries require native modules, so we use the `xz`
// binary instead, when available.
export const shouldUseXz = function(version) {
  return versionHasXz(version) && platform !== 'aix' && hasXzBinary()
}

// Older Node.js versions only shipped .tar.gz not .tar.xz
const versionHasXz = function(version) {
  return satisfies(version, XZ_VERSION_RANGE)
}

const XZ_VERSION_RANGE = '^0.10.42 || >=0.12.10'

const mHasXzBinary = async function() {
  const { failed } = await execa.command('xz --version', {
    reject: false,
    stdio: 'ignore',
  })
  return !failed
}

const hasXzBinary = moize(mHasXzBinary)

export const downloadXz = async function({ version, tmpFile, arch, opts }) {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.xz`,
    opts,
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
