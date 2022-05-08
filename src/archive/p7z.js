import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { delimiter, normalize } from 'path'
import { env } from 'process'
import { pipeline } from 'stream'
import { promisify } from 'util'

import { execa } from 'execa'
import moize from 'moize'
import pathKey from 'path-key'
import semver from 'semver'

// eslint-disable-next-line import/max-dependencies
import { fetchNodeUrl, promiseOrFetchError, writeNodeBinary } from '../fetch.js'

// TODO: replace with `stream/promises` once dropping support for Node <15.0.0
const pPipeline = promisify(pipeline)

// .7z Node binaries for Windows were added in Node 4.5.0 and 6.2.1
// We try those first since they are smaller. However they require 7zip to be
// installed globally by the user since there is no good Node.js library to
// extract .7z files.
export const shouldUse7z = function (version) {
  return versionHas7z(version) && has7zBinary()
}

const versionHas7z = function (version) {
  return semver.satisfies(version, P7Z_VERSION_RANGE)
}

const P7Z_VERSION_RANGE = '^4.5.0 || >=6.2.1'

const mHas7zBinary = async function () {
  const { failed } = await execa('7z', {
    reject: false,
    stdio: 'ignore',
    env: getEnv(),
  })
  return !failed
}

const has7zBinary = moize(mHas7zBinary, { maxSize: 1e3 })

// 7zip does not support stdin streaming with *.7z but it supports stdout
// streaming. So we first download the archive to a temporary file, then extract
// it in streaming mode.
export const download7z = async function ({
  version,
  tmpFile,
  arch,
  fetchOpts,
}) {
  const filepath = get7zFilepath(version, arch)
  const tmp7zFile = `${tmpFile}.7z`

  const { response, checksumError } = await fetchNodeUrl(
    version,
    `${filepath}.7z`,
    fetchOpts,
  )
  await pPipeline(response, createWriteStream(tmp7zFile))
  const { stdout, cancel } = execa(
    '7z',
    ['x', '-so', `-i!${filepath}/node.exe`, tmp7zFile],
    {
      stdin: 'ignore',
      stdout: 'pipe',
      stderr: 'ignore',
      buffer: false,
      env: getEnv(),
    },
  )
  const promise = pPipeline(stdout, writeNodeBinary(tmpFile))

  try {
    await promiseOrFetchError(promise, response)
  } finally {
    await cleanup(tmp7zFile, cancel)
  }

  return checksumError
}

const get7zFilepath = function (version, arch) {
  return `node-v${version}-win-${arch}`
}

// 7-Zip is usually installed there, but not in the PATH
const getEnv = function () {
  const path = `${env[PATH_KEY]}${delimiter}${P7Z_PATH}`
  return { Path: path, PATH: path }
}

const P7Z_PATH = normalize('/Program Files/7-Zip')
const PATH_KEY = pathKey()

const cleanup = async function (tmp7zFile, cancel) {
  await unlink(tmp7zFile)
  cancel()
}
