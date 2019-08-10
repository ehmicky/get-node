import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve, basename } from 'path'
import { cwd } from 'process'

import test from 'ava'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

const TMP_DIR = `${tmpdir()}/test-get-node-`

const getOutputDir = function() {
  const id = String(Math.random()).replace('.', '')
  return `${TMP_DIR}${id}`
}

test('Success', async t => {
  const nodePath = await getNode('6.0.0', getOutputDir())

  t.true(await pathExists(nodePath))

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Default version to *', async t => {
  const [nodePath, nodePathA] = await Promise.all([
    getNode('*', getOutputDir()),
    getNode(undefined, getOutputDir()),
  ])

  t.is(basename(resolve(nodePath, '..')), basename(resolve(nodePathA, '..')))

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Default outputDir to current directory', async t => {
  const nodePath = await getNode()

  t.is(resolve(nodePath, '../..'), cwd())

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
})
