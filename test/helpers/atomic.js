import { argv, exit } from 'process'
import { promisify } from 'util'

import getNode from '../../src/main.js'

const pSetTimeout = promisify(setTimeout)

const [, , versionRange, outputDir] = argv

const launchThenAbort = async function() {
  getNode(versionRange, outputDir, { progress: false })

  await pSetTimeout(TIMEOUT)
  exit(0)
}

const TIMEOUT = 5e2

launchThenAbort()
