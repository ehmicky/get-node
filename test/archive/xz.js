import { env } from 'process'

import test from 'ava'
import pathKey from 'path-key'
import pathExists from 'path-exists'

import getNode from '../../src/main.js'
import { getOutput, removeOutput } from '../helpers/main.js'
import { TEST_VERSION } from '../helpers/versions.js'

const PATH_KEY = pathKey()

test.serial('Works when no xz binary exists', async t => {
  const pathEnv = env[PATH_KEY]
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = ''

  try {
    const output = getOutput()
    const { path } = await getNode(TEST_VERSION, { output })

    t.true(await pathExists(path))

    await removeOutput(path)
  } finally {
    // eslint-disable-next-line fp/no-mutation, require-atomic-updates
    env[PATH_KEY] = pathEnv
  }
})
