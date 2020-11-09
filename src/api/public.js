export default function valid(response) {
  return response.data !== null && response.data !== 404 && response.data.code !== 404
}

