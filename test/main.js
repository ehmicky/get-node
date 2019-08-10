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

each([getNode, getNodeCli], ({ title }, getNodeFunc) => {
  test(`Downloads node | ${title}`, async t => {
    const versionRange = '6.0.0'
    const outputDir = getOutputDir()
    await getNodeFunc(versionRange, outputDir)

    const nodeFilename = platform === 'win32' ? 'node.exe' : 'node'
    const nodePath = `${outputDir}/${versionRange}/${nodeFilename}`

    const { stdout } = await pExecFile(nodePath, ['--version'])
    t.is(stdout.trim(), 'v6.0.0')

    await pUnlink(nodePath)
    await pRmdir(resolve(nodePath, '..'))
    await pRmdir(resolve(nodePath, '../..'))
  })
})

test('Returns filepath', async t => {
  const nodePath = await getNode('6.0.0', getOutputDir())

  t.true(await pathExists(nodePath))

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Version range', async t => {
  const nodePath = await getNode('6', getOutputDir())

  t.true(await pathExists(nodePath))

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Caching', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode('6.0.0', outputDir)
  const nodePathA = await getNode('6.0.0', outputDir)

  t.is(nodePath, nodePathA)

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Re-using outputDir', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode('6.0.0', outputDir)
  const nodePathA = await getNode('7.0.0', outputDir)

  t.is(resolve(nodePath, '../..'), resolve(nodePathA, '../..'))

  await pUnlink(nodePath)
  await pUnlink(nodePathA)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePathA, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})

test('Default version to *', async t => {
  const outputDir = getOutputDir()
  const nodePath = await getNode('*', outputDir)
  const nodePathA = await getNode(undefined, outputDir)

  t.is(nodePath, nodePathA)

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

each(
  [[true, ''], ['not_a_version_range', ''], ['6', true], ['90', '']],
  ({ title }, [versionRange, outputDir]) => {
    test(`Invalid arguments | ${title}`, async t => {
      await t.throwsAsync(getNode(versionRange, outputDir))
    })
  },
)
