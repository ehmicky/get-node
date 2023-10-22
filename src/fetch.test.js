import { stderr } from 'node:process'

import test from 'ava'
import { spy } from 'sinon'
import { each } from 'test-each'

import { getNodeVersion } from './helpers/main.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

each(
  [
    ...(stderr.isTTY ? [{ progress: true, called: true }] : []),
    { progress: false, called: false },
    { called: false },
  ],
  ({ title }, { progress, called }) => {
    test.serial(`Progress bar | ${title}`, async (t) => {
      const spyA = spy(stderr, 'write')

      const { cleanup } = await getNodeVersion(TEST_VERSION, { progress })
      await cleanup()

      t.is(spyA.called, called)

      spyA.restore()
    })
  },
)
