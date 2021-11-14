import test from 'ava'
import { each } from 'test-each'

import { getNodeVersion } from './helpers/main.js'

each(
  [
    { versionRange: true },
    { versionRange: 'not_a_version_range' },
    { versionRange: '90' },
    { output: true },
    { progress: 0 },
    { cwd: true },
  ],
  ({ title }, { versionRange, ...opts }) => {
    test(`Invalid arguments | ${title}`, async (t) => {
      await t.throwsAsync(getNodeVersion(versionRange, opts))
    })
  },
)

test('Defaults version to *', async (t) => {
  const { path, cleanup, output } = await getNodeVersion('*')
  const { path: pathA } = await getNodeVersion(undefined, { output })

  t.is(path, pathA)

  await cleanup()
})
