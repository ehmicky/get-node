import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'
import { execFile } from 'child_process'

import test from 'ava'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

import {
  TEST_VERSION,
  getOutput,
  removeOutput,
  removeOutputDir,
  getNodePath,
  getNodeCli,
} from './helpers/main.js'

const ATOMIC_PROCESS = `${__dirname}/helpers/atomic.js`

const pUnlink = promisify(unlink)
const pExecFile = promisify(execFile)

test('Caches download', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output, progress: false })
  const { path: pathA } = await getNode(TEST_VERSION, {
    output,
    progress: false,
  })

  t.is(path, pathA)

  await removeOutput(path)
})

test('Can re-use same output', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output, progress: false })
  await pUnlink(path)

  const { path: pathA } = await getNode(TEST_VERSION, {
    output,
    progress: false,
  })
  await pUnlink(pathA)

  t.is(resolve(path, '..'), resolve(pathA, '..'))

  await removeOutputDir(path)
})

test('Parallel downloads', async t => {
  const output = getOutput()
  const [{ path }, { path: pathA }] = await Promise.all([
    getNode(TEST_VERSION, { output, progress: false }),
    getNode(TEST_VERSION, { output, progress: false }),
  ])

  t.is(path, pathA)

  await removeOutput(path)
})

test('Writes atomically', async t => {
  const output = getOutput()
  await pExecFile('node', [ATOMIC_PROCESS, TEST_VERSION, output])

  const path = getNodePath(TEST_VERSION, output)

  t.false(await pathExists(path))
  t.false(await pathExists(resolve(path, '..')))
  t.false(await pathExists(resolve(path, '../..')))
})

test(`HTTP errors | programmatic`, async t => {
  await t.throwsAsync(
    getNode(TEST_VERSION, { progress: false, mirror: INVALID_MIRROR }),
  )
})

test(`HTTP errors | CLI`, async t => {
  const error = await t.throwsAsync(
    getNodeCli(TEST_VERSION, { progress: false, mirror: INVALID_MIRROR }),
  )
  t.notRegex(error.message, STACK_TRACE_REGEXP)
})

const INVALID_MIRROR = 'https://example.com'
const STACK_TRACE_REGEXP = /^\s*at/mu
