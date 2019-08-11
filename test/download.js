import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'
import { execFile } from 'child_process'

import test from 'ava'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

import {
  TEST_VERSION,
  getOutputDir,
  removeOutput,
  removeOutputDir,
  getNodePath,
} from './helpers/main.js'

const ATOMIC_PROCESS = `${__dirname}/helpers/atomic.js`

const pUnlink = promisify(unlink)
const pExecFile = promisify(execFile)

test('Caches download', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir)
  const nodePathA = await getNode(TEST_VERSION, outputDir)

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

test('Parallel downloads', async t => {
  const outputDir = getOutputDir()
  const [nodePath, nodePathA] = await Promise.all([
    getNode(TEST_VERSION, outputDir),
    getNode(TEST_VERSION, outputDir),
  ])

  t.is(nodePath, nodePathA)

  await removeOutput(nodePath)
})

test('Writes atomically', async t => {
  const outputDir = getOutputDir()

  await pExecFile('node', [ATOMIC_PROCESS, TEST_VERSION, outputDir])

  const nodePath = getNodePath(TEST_VERSION, outputDir)

  t.false(await pathExists(nodePath))
  t.false(await pathExists(resolve(nodePath, '..')))
  t.false(await pathExists(resolve(nodePath, '../..')))
})
