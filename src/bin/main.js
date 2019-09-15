#!/usr/bin/env node
import { exit } from 'process'

import getNode from '../main.js'

import { defineCli } from './top.js'
import { parseOpts } from './parse.js'
import { removeStackTrace } from './stack.js'

// Download the Node.js binary for a specific `versionRange`
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRange, output, ...opts } = parseOpts(yargs)
    const { path } = await getNode(versionRange, { output, ...opts })
    console.log(path)
  } catch (error) {
    const message = removeStackTrace(error.message)
    console.error(message)
    exit(1)
  }
}

runCli()
