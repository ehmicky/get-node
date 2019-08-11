import { promisify } from 'util'
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
  getNodePath,
} from './helpers/main.js'

const pExecFile = promisify(execFile)
const pSetTimeout = promisify(setTimeout)

each([getNode, getNodeCli], ({ title }, getNodeFunc) => {
  test(`Downloads node | ${title}`, async t => {
    const outputDir = getOutputDir()
    await getNodeFunc(TEST_VERSION, outputDir)

    const nodePath = getNodePath(TEST_VERSION, outputDir)

    const { stdout } = await pExecFile(nodePath, ['--version'])
    t.is(stdout.trim(), `v${TEST_VERSION}`)

    await pSetTimeout(REMOVE_TIMEOUT)

    await removeOutput(nodePath)
  })
})

// We need to wait a little for Windows to release the lock on the `node`
// executable before cleaning it
const REMOVE_TIMEOUT = 1e3

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
