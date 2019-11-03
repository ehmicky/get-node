import { platform, arch } from 'process'
import { cpus } from 'os'

import fetchNodeWebsite from 'fetch-node-website'
import execa from 'execa'
import moize from 'moize'
import { satisfies } from 'semver'

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

export const downloadXz = async function(version, opts) {
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
