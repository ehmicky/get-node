import { env } from 'process'
import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'

import test from 'ava'
import { each } from 'test-each'
import pathExists from 'path-exists'
import execa from 'execa'
import pathKey from 'path-key'

import getNode from '../src/main.js'

import {
  getOutput,
  removeOutput,
  removeOutputDir,
  getNodePath,
} from './helpers/main.js'
// eslint-disable-next-line import/max-dependencies
import { NO_XZ_VERSION, TEST_VERSION } from './helpers/versions.js'

const ATOMIC_PROCESS = `${__dirname}/helpers/atomic.js`

const pUnlink = promisify(unlink)

test('Caches download', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })
  const { path: pathA } = await getNode(TEST_VERSION, { output })

  t.is(path, pathA)

  await removeOutput(path)
})

test('Can re-use same output', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })
  await pUnlink(path)

  const { path: pathA } = await getNode(TEST_VERSION, { output })
  await pUnlink(pathA)

  t.is(resolve(path, '..'), resolve(pathA, '..'))

  await removeOutputDir(path)
})

test('Parallel downloads', async t => {
  const output = getOutput()
  const [{ path }, { path: pathA }] = await Promise.all([
    getNode(TEST_VERSION, { output }),
    getNode(TEST_VERSION, { output }),
  ])

  t.is(path, pathA)

  await removeOutput(path)
})

test('Writes atomically', async t => {
  const output = getOutput()
  await execa('node', [ATOMIC_PROCESS, TEST_VERSION, output])

  const path = getNodePath(TEST_VERSION, output)

  t.false(await pathExists(path))
  t.false(await pathExists(resolve(path, '..')))
  t.false(await pathExists(resolve(path, '../..')))
})

each(
  [
    { mirror: 'https://unknown-mirror.com', message: /Could not connect/u },
    // We cannot test this since all the OS/architecture tested in CI have
    // Node.js binaries. So we simulate it by using a `mirror` to an existing
    // website, leading to a 404.
    { mirror: 'https://example.com', message: /No Node\.js binaries/u },
  ],
  [NO_XZ_VERSION, TEST_VERSION],
  ({ title }, { mirror, message }, version) => {
    test(`HTTP error | ${title}`, async t => {
      // Ensure normalize-node-version is cached
      await getNode(version)

      const output = getOutput()
      await t.throwsAsync(getNode(version, { output, mirror }), message)
    })
  },
)

test.serial('Works when no xz binary exists', async t => {
  const pathEnv = env[PATH_KEY]
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = ''

  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })

  t.true(await pathExists(path))

  await removeOutput(path)

  // eslint-disable-next-line fp/no-mutation, require-atomic-updates
  env[PATH_KEY] = pathEnv
})

const PATH_KEY = pathKey()
