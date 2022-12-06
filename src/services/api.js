import toPairs from 'lodash/toPairs'
import 'whatwg-fetch'

const SPOTIFY_ROOT = 'https://api.spotify.com/v1'

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = response => {
  if (response.status === 204 || response.status === 205) {
    return null
  }
  return response.json()
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export const request = (url, options) => {
  // eslint-disable-next-line no-undef
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}

const fetchFromSpotify = ({ token, endpoint, params }) => {
  let url = [SPOTIFY_ROOT, endpoint].join('/')
  if (params) {
    const paramString = toPairs(params)
      .map(param => param.join('='))
      .join('&')
    url += `?${paramString}`
  }
  const options = { headers: { Authorization: `Bearer ${token}` } }
  return request(url, options)
}

export default fetchFromSpotify
