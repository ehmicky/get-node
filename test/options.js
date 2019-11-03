import test from 'ava'
import { each } from 'test-each'

import getNode from '../src/main.js'

import { getOutput, removeOutput } from './helpers/main.js'

each(
  [
    { versionRange: true },
    { versionRange: 'not_a_version_range' },
    { versionRange: '90' },
    { output: true },
    { progress: 0 },
  ],
  ({ title }, { versionRange, ...opts }) => {
    test(`Invalid arguments | ${title}`, async t => {
      await t.throwsAsync(getNode(versionRange, opts))
    })
  },
)

test('Defaults version to *', async t => {
  const output = getOutput()
  const { path } = await getNode('*', { output })
  const { path: pathA } = await getNode(undefined, { output })

  t.is(path, pathA)

  await removeOutput(path)
})
