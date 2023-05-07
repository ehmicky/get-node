import { argv, exit } from 'node:process'
import { setTimeout } from 'node:timers/promises'

import getNode from 'get-node'

const [, , versionRange, output] = argv

const launchThenAbort = async () => {
  getNode(versionRange, { output, progress: false })

  await setTimeout(TIMEOUT)
  exit(0)
}

const TIMEOUT = 5e2

await launchThenAbort()
