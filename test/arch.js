import { arch, platform } from 'process'

import test from 'ava'
import execa from 'execa'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

import { getOutput, removeOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

test('--arch current', async t => {
  const output = getOutput()
  const { path, version } = await getNode(TEST_VERSION, { output, arch })

  const result = await execa(path, ['--version'])
  t.is(result.stdout, `v${version}`)

  await removeOutput(path)
})

if (platform === 'linux') {
  test('--arch other', async t => {
    const output = getOutput()
    const { path } = await getNode(TEST_VERSION, { output, arch: 'arm64' })

    await pathExists(path)
    await t.throwsAsync(execa(path, ['--version']))

    await removeOutput(path)
  })
}

test('--arch invalid', async t => {
  await t.throwsAsync(getNode(TEST_VERSION, { arch: 'invalid' }))
})
