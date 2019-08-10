import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'
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
  removeOutputDir,
  getNodeCli,
} from './helpers/main.js'

const pUnlink = promisify(unlink)
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

test('Caches download', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir)
  const nodePathA = await getNode(TEST_VERSION, outputDir)

  t.is(nodePath, nodePathA)

  await removeOutput(nodePath)
})

test('Writes atomically', async t => {
  const outputDir = getOutputDir()
  const [nodePath, nodePathA] = await Promise.all([
    getNode(TEST_VERSION, outputDir),
    getNode(TEST_VERSION, outputDir),
  ])

  t.is(nodePath, nodePathA)

  await removeOutput(nodePath)
})

test('Can re-use same outputDir', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir)
  await pUnlink(nodePath)

  const nodePathA = await getNode(TEST_VERSION, outputDir)
  await pUnlink(nodePathA)

  t.is(resolve(nodePath, '..'), resolve(nodePathA, '..'))

  await removeOutputDir(nodePath)
})
