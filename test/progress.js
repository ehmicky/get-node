import { stderr } from 'process'

import test from 'ava'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import getNode from 'get-node'
import sinon from 'sinon'
import { each } from 'test-each'

import { getOutput, removeOutput } from './helpers/main.js'
import { TEST_VERSION } from './helpers/versions.js'

each(
  [
    ...(stderr.isTTY ? [{ progress: true, called: true }] : []),
    { progress: false, called: false },
    { called: false },
  ],
  ({ title }, { progress, called }) => {
    test.serial(`Progress bar | ${title}`, async (t) => {
      const spy = sinon.spy(stderr, 'write')

      const output = getOutput()
      const { path } = await getNode(TEST_VERSION, { progress, output })
      await removeOutput(path)

      t.is(spy.called, called)

      spy.restore()
    })
  },
)
