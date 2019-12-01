import { platform, arch } from 'process'

// Retrieve the CPU architecture as used in binary filenames
export const getArch = function() {
  const archA = PLATFORMS[arch]

  // We currently only run CI tests on supported CPU architectures
  // istanbul ignore next
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
  // istanbul ignore next
  ppc64: platform === 'aix' ? 'ppc64' : 'ppc64le',
  s390: 's390x',
  s390x: 's390x',
  x32: 'x86',
  x64: 'x64',
}
