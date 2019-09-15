import yargs from 'yargs'

export const defineCli = function() {
  return yargs
    .options(CONFIG)
    .usage(USAGE)
    .help()
    .version()
    .strict()
}

const CONFIG = {}

const USAGE = `$0 [OPTIONS...] [VERSION] [OUTPUT_DIRECTORY]

Download a specific version of Node.js.
The path to the Node.js executable is printed on stdout.`
