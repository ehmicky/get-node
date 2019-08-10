import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'

import test from 'ava'
import { each } from 'test-each'

import getNode from '../src/main.js'

import { getOutputDir, removeOutput, getNodeCli } from './helpers/main.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

each(
  [[true, ''], ['not_a_version_range', ''], ['6', true], ['90', '']],
  ({ title }, [versionRange, outputDir]) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(getNode(versionRange, outputDir))
    })
  },
)

test('Invalid arguments | CLI', async t => {
  await t.throwsAsync(getNodeCli('not_a_version_range', ''))
})

test('Defaults version to *', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode('*', outputDir)
  const nodePathA = await getNode(undefined, outputDir)

  t.is(nodePath, nodePathA)

  await removeOutput(nodePath)
})

test('Defaults outputDir to current directory', async t => {
  const nodePath = await getNode()

  t.is(resolve(nodePath, '../..'), cwd())

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
})
