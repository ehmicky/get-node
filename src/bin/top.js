import yargs from 'yargs'

export const defineCli = function() {
  return yargs
    .options(CONFIG)
    .usage(USAGE)
    .help()
    .version()
    .strict()
}

const CONFIG = {
  progress: {
    alias: 'p',
    boolean: true,
    describe: `Show a loading spinner. Default: true`,
  },
  mirror: {
    alias: 'm',
    string: true,
    requiresArg: true,
    describe: `Base URL. Defaults to 'https://nodejs.org/dist'.
Can be customized (for example "https://npm.taobao.org/mirrors/node").

The following environment variables can also be used: NODE_MIRROR, NVM_NODEJS_ORG_MIRROR, N_NODE_MIRROR or NODIST_NODE_MIRROR.`,
  },
}

const USAGE = `$0 [OPTIONS...] [VERSION] [OUTPUT_DIRECTORY]

Download a specific version of Node.js.
The path to the Node.js executable is printed on stdout.`
