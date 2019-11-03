import { env, platform, arch } from 'process'

import test from 'ava'

import getNode from '../src/main.js'

import { getOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

test.serial('Checks checksums', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CHECKSUMS =
    platform === 'win32'
      ? `abcdef  win-${arch}/node.exe`
      : `abcdef  node-v${TEST_VERSION}-${platform}-${arch}.tar.xz`

  const output = getOutput()

  try {
    await t.throwsAsync(
      getNode(TEST_VERSION, { output }),
      /checksum did not match/u,
    )
  } finally {
    // eslint-disable-next-line fp/no-delete
    delete env.TEST_CHECKSUMS
  }
})

test.serial('Throws on corrupted checksums', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CHECKSUMS = ''

  const output = getOutput()

  try {
    await t.throwsAsync(getNode(TEST_VERSION, { output }), /checksum:/u)
  } finally {
    // eslint-disable-next-line fp/no-delete
    delete env.TEST_CHECKSUMS
  }
})
