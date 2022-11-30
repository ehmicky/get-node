import { rm } from 'node:fs/promises'
import { dirname, resolve, normalize } from 'node:path'
import { arch } from 'node:process'

import test from 'ava'
import globalCacheDir from 'global-cache-dir'

import { getNodeDir, getNodeVersion } from './helpers/main.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

test.serial('Defaults output to cache directory', async (t) => {
  const cacheDir = await globalCacheDir('nve')
  const nodeDir = resolve(cacheDir, TEST_VERSION, arch)
  await rm(nodeDir, { force: true, recursive: true })

  const { path } = await getNodeVersion(TEST_VERSION, { output: undefined })

  t.is(getNodeDir(path), nodeDir)
})

test('Can use output option', async (t) => {
  const { path, output, cleanup } = await getNodeVersion(TEST_VERSION)

  t.is(dirname(dirname(getNodeDir(path))), normalize(output))

  await cleanup()
})
