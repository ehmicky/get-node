import { env, platform, arch } from 'process'

import test from 'ava'

import { getNodeVersion } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

// When run on Windows, the tests require '7z' to be installed globally
test.serial('Checks checksums', async (t) => {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CHECKSUMS =
    platform === 'win32'
      ? `abcdef  node-v${TEST_VERSION}-win-${arch}.7z`
      : `abcdef  node-v${TEST_VERSION}-${platform}-${arch}.tar.xz`

  try {
    await t.throwsAsync(getNodeVersion(TEST_VERSION), {
      message: /checksum did not match/u,
    })
  } finally {
    // eslint-disable-next-line fp/no-delete
    delete env.TEST_CHECKSUMS
  }
})

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
