import { tmpdir } from 'os'
import { promisify } from 'util'
import { unlink, rmdir } from 'fs'
import { resolve } from 'path'

import test from 'ava'
import pathExists from 'path-exists'

import getNode from '../src/main.js'

const pUnlink = promisify(unlink)
const pRmdir = promisify(rmdir)

test('Success', async t => {
  const id = String(Math.random()).replace('.', '')
  const outputDir = `${tmpdir()}/test-get-node-${id}`
  const versionRange = '6.0.0'

  const nodePath = await getNode(versionRange, outputDir)

  t.true(await pathExists(nodePath))

  await pUnlink(nodePath)
  await pRmdir(resolve(nodePath, '..'))
  await pRmdir(resolve(nodePath, '../..'))
})
