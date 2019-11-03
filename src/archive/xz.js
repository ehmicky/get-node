import { platform, arch } from 'process'
import { cpus } from 'os'

import fetchNodeWebsite from 'fetch-node-website'
import execa from 'execa'
import moize from 'moize'

// Node provides with .tar.xz that are twice smaller. We try to use those.
// Those are not available for AIX nor 0.*.* versions.
// All existing xz/LZMA libraries require native modules, so we use the `xz`
// binary instead, when available.
export const shouldUseXz = function(version) {
  return !version.startsWith('0.') && platform !== 'aix' && hasXz()
}

// Check if there is a xz binary
const mHasXz = async function() {
  const { failed } = await execa.command('xz --version', { reject: false })
  return !failed
}

const hasXz = moize(mHasXz)

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
