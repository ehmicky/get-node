import { arch, platform } from 'process'

import test from 'ava'
import { execa } from 'execa'
import { pathExists } from 'path-exists'

import { getNodeVersion } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

test('--arch current', async (t) => {
  const { path, version, cleanup } = await getNodeVersion(TEST_VERSION, {
    arch,
  })

  const { stdout } = await execa(path, ['--version'])
  t.is(stdout, `v${version}`)

  await cleanup()
})

if (platform === 'linux') {
  test('--arch other', async (t) => {
    const { path, cleanup } = await getNodeVersion(TEST_VERSION, {
      arch: 'arm64',
    })

    await pathExists(path)
    await t.throwsAsync(execa(path, ['--version']))

    await cleanup()
  })
}

test('--arch invalid', async (t) => {
  await t.throwsAsync(getNodeVersion(TEST_VERSION, { arch: 'invalid' }))
})
