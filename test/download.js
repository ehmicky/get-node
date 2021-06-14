import test from 'ava'
import execa from 'execa'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import getNode from 'get-node'
import pathExists from 'path-exists'
import { each } from 'test-each'

import { getOutput, removeOutput } from './helpers/main.js'
import { NO_XZ_VERSION, TEST_VERSION } from './helpers/versions.js'

const ATOMIC_PROCESS = `${__dirname}/helpers/atomic.js`

test('Caches download', async (t) => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })
  const { path: pathA } = await getNode(TEST_VERSION, { output })

  t.is(path, pathA)

  await removeOutput(path)
})

test('Parallel downloads', async (t) => {
  const output = getOutput()
  const [{ path }, { path: pathA }] = await Promise.all([
    getNode(TEST_VERSION, { output }),
    getNode(TEST_VERSION, { output }),
  ])

  t.is(path, pathA)

  await removeOutput(path)
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
      await getNode(TEST_VERSION)

      const outputA = getOutput()
      await t.throwsAsync(getNode(version, { output: outputA, mirror }), {
        message,
      })
    })
  },
)
