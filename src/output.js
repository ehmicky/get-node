import globalCacheDir from 'global-cache-dir'

// Add `output` default value
export const addOutput = async function(opts) {
  const output = await getOutput(opts)
  return { ...opts, output }
}

const getOutput = async function({ output }) {
  if (output !== undefined) {
    return output
  }

  const outputA = await globalCacheDir(CACHE_DIR)
  return outputA
}

const CACHE_DIR = 'nve'
