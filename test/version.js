import { version as processVersion, env } from 'process'

import test from 'ava'
import execa from 'execa'
import pathExists from 'path-exists'
import { each } from 'test-each'

import getNode from '../src/main.js'

import { getOutput, removeOutput } from './helpers/main.js'
import {
  NO_BIN_VERSION,
  GLOBAL_VERSION,
  LOCAL_VERSION,
} from './helpers/versions.js'

test('Does not work on very old versions', async (t) => {
  await t.throwsAsync(getNode(NO_BIN_VERSION))
})

each([LOCAL_VERSION, GLOBAL_VERSION], ({ title }, alias) => {
  test.serial(
    `"local" and "global" aliases default to current process version | ${title}`,
    async (t) => {
      // eslint-disable-next-line fp/no-mutation
      env.TEST_HOME_DIR = '/'

      try {
        const output = getOutput()
        const { path, version } = await getNode(alias, { output, cwd: '/' })

        t.true(await pathExists(path))
        const { stdout } = await execa(path, ['--version'])
        t.is(stdout, processVersion)
        t.is(`v${version}`, processVersion)

        await removeOutput(path)
      } finally {
        // eslint-disable-next-line fp/no-delete
        delete env.TEST_HOME_DIR
      }
    },
  )
})
