import fetch from 'cross-fetch'

// Make a HTTP GET request
export const fetchUrl = async function(path) {
  const url = `${URL_BASE}/${path}`

  const response = await performFetch(url)

  if (!response.ok) {
    throw new Error(`Could not fetch ${url} (status ${response.status})`)
  }

  return response
}

const performFetch = async function(url) {
  try {
    return await fetch(url)
  } catch (error) {
    throw new Error(`Could not fetch ${url}\n\n${error.stack}`)
  }
}

const URL_BASE = 'https://nodejs.org/dist'
