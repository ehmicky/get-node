import { platform } from 'process'

import { downloadGz } from './gz.js'
import { shouldUse7z, download7z } from './p7z.js'
import { downloadRaw } from './raw.js'
import { shouldUseXz, downloadXz } from './xz.js'
import { shouldUseZip, downloadZip } from './zip.js'

// Retrieve the Node binary from the Node website and persist it.
// The URL depends on the current OS and CPU architecture.
export const downloadRuntime = function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  if (platform === 'win32') {
    return downloadWindowsNode({ version, tmpFile, arch, fetchOpts })
  }

  // istanbul ignore else
  if (SUPPORTED_UNIX.has(platform)) {
    return downloadUnixNode({ version, tmpFile, arch, fetchOpts })
  }

  // TODO: support android, freebsd and openbsd.
  // https://nodejs.org/dist does not deliver binaries for those platforms.
  // We currently do not run CI tests on those platforms
  // istanbul ignore next
  throw new Error(`Unsupported platform: ${platform}`)
}

const SUPPORTED_UNIX = new Set(['linux', 'darwin', 'aix', 'sunos'])

// The Windows Node binary comes as a regular file or as a .zip file. We try
// to use the fastest method.
export const downloadWindowsNode = async function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  if (await shouldUse7z(version)) {
    return download7z({ version, tmpFile, arch, fetchOpts })
  }

  if (shouldUseZip(version)) {
    return downloadZip({ version, tmpFile, arch, fetchOpts })
  }

  return downloadRaw({ version, tmpFile, arch, fetchOpts })
}

// The Unix Node binary comes in a .tar.gz or .tar.xz archive.
export const downloadUnixNode = async function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  if (await shouldUseXz(version)) {
    return downloadXz({ version, tmpFile, arch, fetchOpts })
  }

  return downloadGz({ version, tmpFile, arch, fetchOpts })
}
