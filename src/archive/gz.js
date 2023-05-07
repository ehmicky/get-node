import { platform } from 'node:process'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'

import { fetchNodeUrl, promiseOrFetchError } from '../fetch.js'

import { untar, moveTar } from './tar.js'

// Downloads .tar.gz archive and extract it
export const downloadGz = async ({ version, arch, tmpFile, fetchOpts }) => {
  const { response, checksumError } = await fetchNodeUrl(
    version,
    `node-v${version}-${platform}-${arch}.tar.gz`,
    fetchOpts,
  )
  const promise = pipeline(response, createGunzip(), untar(tmpFile))

  await promiseOrFetchError(promise, response)

  await moveTar(tmpFile)

  return checksumError
}
