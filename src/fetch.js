import { env } from 'process'

import fetch from 'cross-fetch'

// Make a HTTP GET request
export const fetchUrl = async function(path) {
  const urlBase = getUrlBase()
  const url = `${urlBase}/${path}`

  const response = await performFetch(url)

  if (!response.ok) {
    throw new Error(`Could not fetch ${url} (status ${response.status})`)
  }

  return response
}

const getUrlBase = function() {
  if (env.NODE_MIRROR !== undefined && env.NODE_MIRROR !== '') {
    return env.NODE_MIRROR
  }

  return URL_BASE
}

const URL_BASE = 'https://nodejs.org/dist'

const performFetch = async function(url) {
  try {
    return await fetch(url)
  } catch (error) {
    throw new Error(`Could not fetch ${url}\n\n${error.stack}`)
  }
}
