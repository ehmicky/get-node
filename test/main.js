import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'
import { cwd, platform } from 'process'
import { execFile } from 'child_process'

import test from 'ava'
import pathExists from 'path-exists'
import { each } from 'test-each'
import { getBinPath } from 'get-bin-path'

import getNode from '../src/main.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)
const pExecFile = promisify(execFile)

const TMP_DIR = `${tmpdir()}/test-get-node-`

const getOutputDir = function() {
  const id = String(Math.random()).replace('.', '')
  return `${TMP_DIR}${id}`
}

const getNodeCli = async function(versionRange, outputDir) {
  const binPath = await getBinPath()
  await pExecFile(binPath, [versionRange, outputDir])
}

const TEST_VERSION = '6.0.0'

const removeOutput = async function(nodePath) {
  await pUnlink(nodePath)
  await removeOutputDir(nodePath)
}

const removeOutputDir = async function(nodePath) {
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
}

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
  const nodePath = await getNode(TEST_VERSION, getOutputDir())

  t.true(await pathExists(nodePath))

  await removeOutput(nodePath)
})

test('Can use version range', async t => {
  const nodePath = await getNode('6', getOutputDir())

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

test('Can re-use same outputDir', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir)

  await pUnlink(nodePath)

  const nodePathA = await getNode(TEST_VERSION, outputDir)

  t.is(resolve(nodePath, '..'), resolve(nodePathA, '..'))

  await pUnlink(nodePathA)
  await removeOutputDir(nodePath)
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
