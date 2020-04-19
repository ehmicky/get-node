import test from 'ava'
import execa from 'execa'
import pathExists from 'path-exists'
import { each } from 'test-each'

import getNode from '../src/main.js'

import { getOutput, removeOutput } from './helpers/main.js'
import {
  OLDEST_VERSION,
  NO_XZ_VERSION,
  OLD_WIN_VERSION,
  NO_ZIP_VERSION,
  TEST_VERSION,
  TEST_VERSION_RANGE,
  LATEST_VERSION,
  LOCAL_VERSION,
  ALIAS_VERSION,
} from './helpers/versions.js'

each(
  [
    OLDEST_VERSION,
    NO_XZ_VERSION,
    OLD_WIN_VERSION,
    NO_ZIP_VERSION,
    TEST_VERSION,
    TEST_VERSION_RANGE,
    LATEST_VERSION,
    LOCAL_VERSION,
    ALIAS_VERSION,
  ],
  ({ title }, versionInput) => {
    test(`Downloads node | ${title}`, async (t) => {
      const output = getOutput()
      const { path, version } = await getNode(versionInput, { output })

      t.true(await pathExists(path))
      const { stdout } = await execa(path, ['--version'])
      t.is(stdout, `v${version}`)

      await removeOutput(path)
    })
  },
)
