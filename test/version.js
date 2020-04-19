import test from 'ava'

import getNode from '../src/main.js'

import { NO_BIN_VERSION } from './helpers/versions.js'

test('Does not work on very old versions', async (t) => {
  await t.throwsAsync(getNode(NO_BIN_VERSION))
})
