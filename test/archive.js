import { env } from 'process'

import test from 'ava'
import getNode from 'get-node'
import { pathExists } from 'path-exists'
import pathKey from 'path-key'

import { getOutput, removeOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

const PATH_KEY = pathKey()

test.serial('Works when no xz/7z binary exists', async (t) => {
  const { pathEnv, pathExt } = patchPath()

  try {
    const output = getOutput()
    const { path } = await getNode(TEST_VERSION, { output })

    t.true(await pathExists(path))

    await removeOutput(path)
  } finally {
    unpatchPath({ pathEnv, pathExt })
  }
})

const patchPath = function () {
  const pathEnv = env[PATH_KEY]
  const pathExt = env.PATHEXT
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = ''
  // eslint-disable-next-line fp/no-mutation
  env.PATHEXT = '.COM'
  return { pathEnv, pathExt }
}

const unpatchPath = function ({ pathEnv, pathExt }) {
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = pathEnv
  // eslint-disable-next-line fp/no-mutation
  env.PATHEXT = pathExt
}
