import { platform } from 'process'

import { shouldUseXz, downloadXz } from './xz.js'
import { downloadGz } from './gz.js'
import { shouldUse7z, download7z } from './p7z.js'
import { shouldUseZip, downloadZip } from './zip.js'
import { downloadRaw } from './raw.js'

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
export const downloadRuntime = function({ version, tmpFile, arch, opts }) {
  if (platform === 'win32') {
    return downloadWindowsNode({ version, tmpFile, arch, opts })
  }

  // istanbul ignore else
  if (SUPPORTED_UNIX.includes(platform)) {
    return downloadUnixNode({ version, tmpFile, arch, opts })
  }

  // TODO: support android, freebsd and openbsd.
  // https://nodejs.org/dist does not deliver binaries for those platforms.
  // We currently do not run CI tests on those platforms
  // istanbul ignore next
  throw new Error(`Unsupported platform: ${platform}`)
}

const SUPPORTED_UNIX = ['linux', 'darwin', 'aix', 'sunos']

// The Windows Node binary comes as a regular file or as a .zip file. We try
// to use the fastest method.
export const downloadWindowsNode = async function({
  version,
  tmpFile,
  arch,
  opts,
}) {
  if (await shouldUse7z(version)) {
    return download7z({ version, tmpFile, arch, opts })
  }

  if (shouldUseZip(version)) {
    return downloadZip({ version, tmpFile, arch, opts })
  }

  return downloadRaw({ version, tmpFile, arch, opts })
}

// The Unix Node binary comes in a .tar.gz or .tar.xz archive.
export const downloadUnixNode = async function({
  version,
  tmpFile,
  arch,
  opts,
}) {
  if (await shouldUseXz(version)) {
    return downloadXz({ version, tmpFile, arch, opts })
  }

  return downloadGz({ version, tmpFile, arch, opts })
}
