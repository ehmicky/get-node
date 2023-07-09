import test from 'ava'
import { execa } from 'execa'
import { pathExists } from 'path-exists'
import { each } from 'test-each'

import { getNodeVersion, FIXTURES_DIR } from './helpers/main.test.js'
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
} from './helpers/versions.test.js'

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
    `${FIXTURES_DIR}nvmrc/.nvmrc`,
  ],
  ({ title }, versionInput) => {
    test(`Downloads node | ${title}`, async (t) => {
      const { path, version, cleanup } = await getNodeVersion(versionInput)

      t.true(await pathExists(path))
      const { stdout } = await execa(path, ['--version'])
      t.is(stdout, `v${version}`)

      await cleanup()
    })
  },
)
