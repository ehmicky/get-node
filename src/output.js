import globalCacheDir from 'global-cache-dir'

// Retrieve default `output`
export const getDefaultOutput = async () => await globalCacheDir(CACHE_DIR)

const CACHE_DIR = 'nve'

// Validate `output` option
export const validateOutput = (output) => {
  if (typeof output !== 'string') {
    throw new TypeError(`Option "output" must be a string: ${output}`)
  }
}
