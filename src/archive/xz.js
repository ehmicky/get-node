import { cpus } from 'node:os'
import { platform } from 'node:process'
import { pipeline } from 'node:stream/promises'

import { execaCommand } from 'execa'
import mem from 'mem'
import semver from 'semver'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'

import { untar, moveTar } from './tar.js'

// Node provides with .tar.xz that are twice smaller. We try to use those.
// Those are not available for AIX nor 0.*.* versions.
// All existing xz/LZMA libraries require native modules, so we use the `xz`
// binary instead, when available.
export const shouldUseXz = (version) =>
  versionHasXz(version) && platform !== 'aix' && hasXzBinary()

// Older Node.js versions only shipped .tar.gz not .tar.xz
const versionHasXz = (version) => semver.satisfies(version, XZ_VERSION_RANGE)

const XZ_VERSION_RANGE = '^0.10.42 || >=0.12.10'

const mHasXzBinary = async () => {
  const { failed } = await execaCommand('xz --version', {
    reject: false,
    stdio: 'ignore',
  })
  return !failed
}

const hasXzBinary = mem(mHasXzBinary)

export const downloadXz = async ({ version, tmpFile, arch, fetchOpts }) => {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.xz`,
    fetchOpts,
  )
  const { stdout, cancel } = execaCommand(
    `xz --decompress --stdout --threads=${cpus().length}`,
    {
      input: response,
      stdout: 'pipe',
      stderr: 'ignore',
      buffer: false,
    },
  )
  const promise = pipeline(stdout, untar(tmpFile))

  try {
    await promiseOrFetchError(promise, response)
  } finally {
    cancel()
  }

  await moveTar(tmpFile)

  return checksumError
}
