import { promisify } from 'util'
import { unlink } from 'fs'
import { resolve } from 'path'
import { execFile } from 'child_process'

import test from 'ava'
import pathExists from 'path-exists'
import { each } from 'test-each'

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
  const { path } = await getNode(TEST_VERSION, { output })
  const { path: pathA } = await getNode(TEST_VERSION, { output })

  t.is(path, pathA)

  await removeOutput(path)
})

test('Can re-use same output', async t => {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { output })
  await pUnlink(path)

  const { path: pathA } = await getNode(TEST_VERSION, { output })
  await pUnlink(pathA)

  t.is(resolve(path, '..'), resolve(pathA, '..'))

  await removeOutputDir(path)
})

test('Parallel downloads', async t => {
  const output = getOutput()
  const [{ path }, { path: pathA }] = await Promise.all([
    getNode(TEST_VERSION, { output }),
    getNode(TEST_VERSION, { output }),
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

each([getNode, getNodeCli], ({ title }, getNodeFunc) => {
  test(`HTTP errors | ${title}`, async t => {
    await t.throwsAsync(
      getNodeFunc(TEST_VERSION, { progress: false, mirror: INVALID_MIRROR }),
    )
  })
})

const INVALID_MIRROR = 'https://example.com'
