import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'

import test from 'ava'

import getNode from '../src/main.js'

import {
  TEST_VERSION,
  getOutputDir,
  removeOutput,
  removeOutputDir,
} from './helpers/main.js'

const pUnlink = promisify(unlink)

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
