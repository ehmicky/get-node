import { platform } from 'process'
import { createGunzip } from 'zlib'
import { promisify } from 'util'

// TODO: use `require('stream').pipeline` after dropping support for Node 8/9
import pump from 'pump'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'
import { getArch } from '../arch.js'

import { untar, moveTar } from './tar.js'

const pPump = promisify(pump)

// Downloads .tar.gz archive and extract it
export const downloadGz = async function(version, tmpFile, opts) {
  const arch = getArch()
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.gz`,
    opts,
  )
  const promise = pPump(response, createGunzip(), untar(tmpFile))

  await promiseOrFetchError(promise, response)

  await moveTar(tmpFile)

  return checksumError
}
