import { platform } from 'process'

// Retrieve the CPU architecture as used in binary filenames.
// Can be changed with the `arch` option.
export const getArch = function(arch) {
  // istanbul ignore next
  if (platform === 'aix') {
    return 'ppc64'
  }

  const archA = PLATFORMS[arch]

  if (archA === undefined) {
    throw new Error(`Unsupported CPU architecture: ${arch}`)
  }

  return archA
}

const PLATFORMS = {
  arm: 'armv7l',
  arm64: 'arm64',
  ia32: 'x64',
  ppc: 'ppc64le',
  ppc64: 'ppc64le',
  s390: 's390x',
  s390x: 's390x',
  x32: 'x86',
  x64: 'x64',
}
