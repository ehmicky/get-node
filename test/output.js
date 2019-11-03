import { dirname, resolve } from 'path'

import test from 'ava'
import globalCacheDir from 'global-cache-dir'
import del from 'del'

import getNode from '../src/main.js'

import { getOutput, getNodeDir, removeOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

test.serial('Defaults output to cache directory', async t => {
  const cacheDir = await globalCacheDir('nve')
  const nodeDir = resolve(cacheDir, TEST_VERSION)
  await del(nodeDir, { force: true })

  const { path } = await getNode(TEST_VERSION)

  t.is(getNodeDir(path), nodeDir)
})

test('Can use output option', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })

  t.is(dirname(getNodeDir(path)), output)

  await removeOutput(path)
})
