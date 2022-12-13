import { env, platform, arch } from 'node:process'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import { shouldUseXz } from './archive/xz.js'
import { getNodeVersion } from './helpers/main.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

// When run on Windows, the tests require '7z' to be installed globally
test.serial('Checks checksums', async (t) => {
  const testChecksum = await getTestChecksum(TEST_VERSION)
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CHECKSUMS = `abcdef  node-v${TEST_VERSION}-${testChecksum}`

  try {
    await t.throwsAsync(getNodeVersion(TEST_VERSION), {
      message: /checksum did not match/u,
    })
  } finally {
    // eslint-disable-next-line fp/no-delete
    delete env.TEST_CHECKSUMS
  }
})

const getTestChecksum = async (version) => {
  if (platform === 'win32') {
    return `win-${arch}.7z`
  }

  const extName = (await shouldUseXz(version)) ? 'xz' : 'gz'
  return `${platform}-${arch}.tar.${extName}`
}

test.serial('Throws on corrupted checksums', async (t) => {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CHECKSUMS = ''

  try {
    await t.throwsAsync(getNodeVersion(TEST_VERSION), { message: /checksum:/u })
  } finally {
    // eslint-disable-next-line fp/no-delete
    delete env.TEST_CHECKSUMS
  }
})
