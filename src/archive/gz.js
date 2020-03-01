import { platform } from 'process'
import { createGunzip } from 'zlib'
import { pipeline } from 'stream'
import { promisify } from 'util'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'

import { untar, moveTar } from './tar.js'

const pPipeline = promisify(pipeline)

// Downloads .tar.gz archive and extract it
export const downloadGz = async function({ version, arch, tmpFile, opts }) {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.gz`,
    opts,
  )
  const promise = pPipeline(response, createGunzip(), untar(tmpFile))

  await promiseOrFetchError(promise, response)

  await moveTar(tmpFile)

  return checksumError
}
