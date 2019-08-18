import { stderr } from 'process'

import test from 'ava'
import sinon from 'sinon'

import getNode from '../src/main.js'

import { TEST_VERSION, getOutputDir, removeOutput } from './helpers/main.js'

const getTempNode = async function(options) {
  const outputDir = getOutputDir()
  const nodePath = await getNode(TEST_VERSION, outputDir, options)
  await removeOutput(nodePath)
}

test.serial('Do not show spinner if opts.progress false', async t => {
  const spy = sinon.spy(stderr, 'write')

  await getTempNode({ progress: false })

  t.true(spy.notCalled)

  spy.restore()
})

test.serial('Show spinner if opts.progress true', async t => {
  const spy = sinon.spy(stderr, 'write')

  await getTempNode({ progress: true })

  t.true(spy.called)

  spy.restore()
})

test.serial('Show spinner by default', async t => {
  const spy = sinon.spy(stderr, 'write')

  await getTempNode()

  t.true(spy.called)

  spy.restore()
})
