import { argv, exit } from 'node:process'
import { promisify } from 'node:util'

import getNode from 'get-node'

// TODO: replace with `timers/promises` `setTimeout()` after dropping support
// for Node <15.0.0
const pSetTimeout = promisify(setTimeout)

const [, , versionRange, output] = argv

const launchThenAbort = async () => {
  getNode(versionRange, { output, progress: false })

  await pSetTimeout(TIMEOUT)
  exit(0)
}

const TIMEOUT = 5e2

await launchThenAbort()
