import { argv, exit } from 'process'
import { promisify } from 'util'

import getNode from '../../src/main.js'

// TODO: replace with `timers/promises` `setTimeout()` after dropping support
// for Node <15.0.0
const pSetTimeout = promisify(setTimeout)

const [, , versionRange, output] = argv

const launchThenAbort = async function () {
  getNode(versionRange, { output, progress: false })

  await pSetTimeout(TIMEOUT)
  exit(0)
}

const TIMEOUT = 5e2

launchThenAbort()
