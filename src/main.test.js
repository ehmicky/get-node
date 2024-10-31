import { arch, platform } from 'node:process'

import test from 'ava'
import { execa } from 'execa'
import { pathExists } from 'path-exists'
import { each } from 'test-each'

import { FIXTURES_DIR, getNodeVersion } from './helpers/main.test.js'
import {
  ALIAS_VERSION,
  LATEST_VERSION,
  LOCAL_VERSION,
  NO_XZ_VERSION,
  NO_ZIP_VERSION,
  OLD_WIN_VERSION,
  OLDEST_VERSION,
  TEST_VERSION,
  TEST_VERSION_RANGE,
} from './helpers/versions.test.js'

each(
  [
    // GitHub actions macOS runs on ARM64.
    // However ARM64 with macOS was only added to Node 16.0.0.
    ...(platform === 'darwin' && arch === 'arm64'
      ? []
      : [OLDEST_VERSION, NO_XZ_VERSION, OLD_WIN_VERSION, NO_ZIP_VERSION]),
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
