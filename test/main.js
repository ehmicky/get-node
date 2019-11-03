import test from 'ava'
import pathExists from 'path-exists'
import execa from 'execa'
import { each } from 'test-each'

import getNode from '../src/main.js'

import {
  NO_BIN_VERSION,
  NO_XZ_VERSION,
  TEST_VERSION,
  TEST_VERSION_RANGE,
  getOutput,
  removeOutput,
} from './helpers/main.js'

each(
  [NO_XZ_VERSION, TEST_VERSION, TEST_VERSION_RANGE],
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

test('Does not work on very old versions', async t => {
  await t.throwsAsync(getNode(NO_BIN_VERSION))
})
