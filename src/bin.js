#!/usr/bin/env node
import { argv, exit } from 'process'

import getNode from './main.js'

// Download the Node.js binary for a specific `versionRange`
const runCli = async function() {
  try {
    const [, , versionRange, output] = argv
    const { path } = await getNode(versionRange, { output })
    console.log(path)
  } catch (error) {
    console.error(error.message)
    exit(1)
  }
}

runCli()
