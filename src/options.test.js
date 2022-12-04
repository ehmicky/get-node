import test from 'ava'
import { each } from 'test-each'

import { getNodeVersion } from './helpers/main.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

import getNode from 'get-node'

each(
  [
    [true],
    ['not_a_version_range'],
    ['90'],
    [TEST_VERSION, true],
    [TEST_VERSION, { output: true }],
    [TEST_VERSION, { arch: 'invalid' }],
  ],
  ({ title }, args) => {
    test(`Invalid arguments | ${title}`, async (t) => {
      await t.throwsAsync(getNode(...args))
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
