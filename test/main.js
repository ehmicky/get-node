import { env } from 'process'

import test from 'ava'
import pathExists from 'path-exists'
import execa from 'execa'
import { each } from 'test-each'
import pathKey from 'path-key'

import getNode from '../src/main.js'

import {
  OLD_VERSION,
  TEST_VERSION,
  TEST_VERSION_RANGE,
  getOutput,
  removeOutput,
} from './helpers/main.js'

each(
  [OLD_VERSION, TEST_VERSION, TEST_VERSION_RANGE],
  ({ title }, versionInput) => {
    test(`Downloads node | ${title}`, async t => {
      const output = getOutput()
      const { path, version } = await getNode(versionInput, { output })

      t.true(await pathExists(path))
      const { stdout } = await execa(path, ['--version'])
      t.is(stdout, `v${version}`)

      await removeOutput(path)
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
