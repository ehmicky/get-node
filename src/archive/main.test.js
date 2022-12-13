import { env } from 'node:process'

import test from 'ava'
import { pathExists } from 'path-exists'
import pathKey from 'path-key'

import { getNodeVersion } from '../helpers/main.test.js'
import { TEST_VERSION } from '../helpers/versions.test.js'

const PATH_KEY = pathKey()

test.serial('Works when no xz/7z binary exists', async (t) => {
  const { pathEnv, pathExt } = patchPath()

  try {
    const { path, cleanup } = await getNodeVersion(TEST_VERSION)

    t.true(await pathExists(path))

    await cleanup()
  } finally {
    unpatchPath({ pathEnv, pathExt })
  }
})

const patchPath = () => {
  const pathEnv = env[PATH_KEY]
  const pathExt = env.PATHEXT
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = ''
  // eslint-disable-next-line fp/no-mutation
  env.PATHEXT = '.COM'
  return { pathEnv, pathExt }
}

const unpatchPath = ({ pathEnv, pathExt }) => {
  // eslint-disable-next-line fp/no-mutation
  env[PATH_KEY] = pathEnv
  // eslint-disable-next-line fp/no-mutation
  env.PATHEXT = pathExt
}
