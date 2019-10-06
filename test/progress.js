import { stderr } from 'process'

import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

import getNode from '../src/main.js'

import { TEST_VERSION, getOutput, removeOutput } from './helpers/main.js'

const getTempNode = async function(opts) {
  const output = getOutput()
  const { path } = await getNode(TEST_VERSION, { ...opts, output })
  await removeOutput(path)
}

each(
  [
    { progress: false, called: false },
    { progress: true, called: true },
    { called: false },
  ],
  ({ title }, { progress, called }) => {
    test.serial(`Progress spinner | ${title}`, async t => {
      const spy = sinon.spy(stderr, 'write')

      await getTempNode({ progress })

      t.is(spy.called, called)

      spy.restore()
    })
  },
)
