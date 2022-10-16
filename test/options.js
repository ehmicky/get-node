import test from 'ava'
import { each } from 'test-each'

import { getNodeVersion } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

each(
  [
    { versionRange: true },
    { versionRange: 'not_a_version_range' },
    { versionRange: '90' },
    { output: true },
    { progress: 0 },
    { arch: 'invalid' },
  ],
  ({ title }, { versionRange, ...opts }) => {
    test(`Invalid arguments | ${title}`, async (t) => {
      await t.throwsAsync(getNodeVersion(versionRange, opts))
    })
  },
)

each(
  [{ cwd: '.' }, { cwd: new URL('.', import.meta.url) }],
  ({ title }, opts) => {
    test(`Valid options | ${title}`, async (t) => {
      const { version } = await getNodeVersion(TEST_VERSION, opts)
      t.is(version, TEST_VERSION)
    })
  },
)

test('Defaults version to *', async (t) => {
  const { path, cleanup, output } = await getNodeVersion('*')
  const { path: pathA } = await getNodeVersion(undefined, { output })

  t.is(path, pathA)

  await cleanup()
})
