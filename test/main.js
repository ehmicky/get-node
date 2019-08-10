import { promisify } from 'util'
import { platform } from 'process'
import { execFile } from 'child_process'

import test from 'ava'
import pathExists from 'path-exists'
import { each } from 'test-each'

import getNode from '../src/main.js'

import {
  TEST_VERSION,
  getOutputDir,
  removeOutput,
  getNodeCli,
} from './helpers/main.js'

const pExecFile = promisify(execFile)

each([getNode, getNodeCli], ({ title }, getNodeFunc) => {
  test(`Downloads node | ${title}`, async t => {
    const outputDir = getOutputDir()
    await getNodeFunc(TEST_VERSION, outputDir)

    const nodeFilename = platform === 'win32' ? 'node.exe' : 'node'
    const nodePath = `${outputDir}/${TEST_VERSION}/${nodeFilename}`
    const { stdout } = await pExecFile(nodePath, ['--version'])
    t.is(stdout.trim(), `v${TEST_VERSION}`)

    await removeOutput(nodePath)
  })
})

test('Returns filepath', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir)

  t.true(await pathExists(nodePath))

  await removeOutput(nodePath)
})

test('Can use version range', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode('6', outputDir)

  t.true(await pathExists(nodePath))

  await removeOutput(nodePath)
})
