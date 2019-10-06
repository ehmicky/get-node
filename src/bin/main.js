#!/usr/bin/env node
import { exit } from 'process'

import getNode from '../main.js'

import { defineCli } from './top.js'
import { parseOpts } from './parse.js'

// Download the Node.js binary for a specific `versionRange`
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRange, ...opts } = parseOpts(yargs)
    const { path } = await getNode(versionRange, { progress: true, ...opts })
    console.log(path)
  } catch (error) {
    console.error(error.message)
    exit(1)
  }
}

runCli()
