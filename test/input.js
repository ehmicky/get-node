import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'

import test from 'ava'
import { each } from 'test-each'
import globalCacheDir from 'global-cache-dir'

import getNode from '../src/main.js'

import {
  TEST_VERSION,
  getOutput,
  removeOutput,
  getNodeCli,
} from './helpers/main.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

each(
  [
    { versionRange: true },
    { versionRange: 'not_a_version_range' },
    { versionRange: '90' },
    { output: true },
    { progress: 0 },
  ],
  ({ title }, { versionRange, ...opts }) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(getNode(versionRange, opts))
    })
  },
)

test('Invalid arguments | CLI', async t => {
  await t.throwsAsync(getNodeCli('not_a_version_range'))
})

test('Defaults version to *', async t => {
  const output = getOutput()
  const { path } = await getNode('*', { output })
  const { path: pathA } = await getNode(undefined, { output })

  t.is(path, pathA)

  await removeOutput(path)
})

test.serial('Defaults output to cache directory', async t => {
  const [{ path }, cacheDir] = await Promise.all([
    getNode(TEST_VERSION),
    globalCacheDir('nve'),
  ])

  t.is(resolve(path, '../..'), cacheDir)

  await pUnlink(path)
  await pRmdir(resolve(path, '..'))
})
