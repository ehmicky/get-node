import { version as processVersion } from 'process'

import test from 'ava'
import execa from 'execa'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

import { getOutput, removeOutput } from './helpers/main.js'
import { NO_BIN_VERSION } from './helpers/versions.js'

test('Does not work on very old versions', async (t) => {
  await t.throwsAsync(getNode(NO_BIN_VERSION))
})

test('"now" alias default to current process version', async (t) => {
  const output = getOutput()
  const { path, version } = await getNode('now', { output })

  t.true(await pathExists(path))
  const { stdout } = await execa(path, ['--version'])
  t.is(stdout, processVersion)
  t.is(`v${version}`, processVersion)

  await removeOutput(path)
})
