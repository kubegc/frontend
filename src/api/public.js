export default function valid(response) {
  return response && response.code === 20000 && response.data !== null
}

