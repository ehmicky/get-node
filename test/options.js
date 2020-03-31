import { join } from 'path'

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

test('Resolve nvmrc pseudo version', async (t) => {
  const output = getOutput()
  const { path } = await getNode('nvmrc', { output, cwd: __dirname })

  t.true(path.includes('12.12.', 'nvmrc version not resolved'))

  await removeOutput(path)
})

test('Throw error if nvmrc not found', async (t) => {
  const output = getOutput()
  await t.throwsAsync(
    getNode('nvmrc', { output, cwd: join(__dirname, '..', 'src') }),
    { message: '.nvmrc file not found' },
  )
})
