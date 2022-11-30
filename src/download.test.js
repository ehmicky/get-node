import { fileURLToPath } from 'node:url'

import test from 'ava'
import { execa } from 'execa'
import { pathExists } from 'path-exists'
import { each } from 'test-each'

import { getOutput, getNodeVersion } from './helpers/main.test.js'
import { NO_XZ_VERSION, TEST_VERSION } from './helpers/versions.test.js'

const ATOMIC_PROCESS = fileURLToPath(
  new URL('helpers/atomic.test.js', import.meta.url),
)

test('Caches download', async (t) => {
  const { path, output, cleanup } = await getNodeVersion(TEST_VERSION)
  const { path: pathA } = await getNodeVersion(TEST_VERSION, { output })

  t.is(path, pathA)

  await cleanup()
})

test('Parallel downloads', async (t) => {
  const output = getOutput()
  const [{ path, cleanup }, { path: pathA }] = await Promise.all([
    getNodeVersion(TEST_VERSION, { output }),
    getNodeVersion(TEST_VERSION, { output }),
  ])

  t.is(path, pathA)

  await cleanup()
})

test('Writes atomically', async (t) => {
  const output = getOutput()
  await execa('node', [ATOMIC_PROCESS, TEST_VERSION, output])

  t.false(await pathExists(output))
})

each(
  [
    {
      mirror: 'https://unknown-mirror.com',
      message: /Could not connect|download/u,
    },
    // We cannot test this since all the OS/architecture tested in CI have
    // Node.js binaries. So we simulate it by using a `mirror` to an existing
    // website, leading to a 404.
    { mirror: 'https://redash.io', message: /No Node\.js binaries/u },
  ],
  [NO_XZ_VERSION, TEST_VERSION],
  ({ title }, { mirror, message }, version) => {
    test(`HTTP error | ${title}`, async (t) => {
      // Ensure all-node-versions is cached
      const { cleanup } = await getNodeVersion(TEST_VERSION)

      await t.throwsAsync(getNodeVersion(version, { mirror }), { message })
      await cleanup()
    })
  },
)
