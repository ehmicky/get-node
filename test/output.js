import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'

import test from 'ava'
import globalCacheDir from 'global-cache-dir'

import getNode from '../src/main.js'

import { getOutput, removeOutputDir } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

test.serial('Defaults output to cache directory', async t => {
  const [{ path }, cacheDir] = await Promise.all([
    getNode(TEST_VERSION),
    globalCacheDir('nve'),
  ])

  t.is(resolve(path, '../..'), cacheDir)

  await pUnlink(path)
  await pRmdir(resolve(path, '..'))
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
