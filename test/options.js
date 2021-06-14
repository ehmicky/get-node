import test from 'ava'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import getNode from 'get-node'
import { each } from 'test-each'

import { getOutput, removeOutput } from './helpers/main.js'

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
      await t.throwsAsync(getNode(versionRange, opts))
    })
  },
)

test('Defaults version to *', async (t) => {
  const output = getOutput()
  const [{ path }, { path: pathA }] = await Promise.all([
    getNode('*', { output }),
    getNode(undefined, { output }),
  ])

  t.is(path, pathA)

  await removeOutput(path)
})
