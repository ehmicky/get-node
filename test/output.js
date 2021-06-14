import { dirname, resolve, normalize } from 'path'
import { arch } from 'process'

import test from 'ava'
import del from 'del'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import getNode from 'get-node'
import globalCacheDir from 'global-cache-dir'

import { getOutput, getNodeDir, removeOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

test.serial('Defaults output to cache directory', async (t) => {
  const cacheDir = await globalCacheDir('nve')
  const nodeDir = resolve(cacheDir, TEST_VERSION, arch)
  await del(nodeDir, { force: true })

  const { path } = await getNode(TEST_VERSION)

  t.is(getNodeDir(path), nodeDir)
})

test('Can use output option', async (t) => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })

  t.is(dirname(dirname(getNodeDir(path))), normalize(output))

  await removeOutput(path)
})
