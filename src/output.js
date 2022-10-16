import globalCacheDir from 'global-cache-dir'

// Retrieve default `output`
export const getDefaultOutput = async function () {
  return await globalCacheDir(CACHE_DIR)
}

const CACHE_DIR = 'nve'

// Validate `output` option
export const validateOutput = function (output) {
  if (typeof output !== 'string') {
    throw new TypeError(`Option "output" must be a string: ${output}`)
  }
}
