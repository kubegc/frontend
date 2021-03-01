import { getResource } from '@/api/k8sResource'
export default function valid(response) {
  return response.data !== null && response.data !== 404 && response.data.code !== 404
}
export function metadata(name) {
  const res = getResource({ kind: 'Metadata', namespace: 'default', name }).then(
    response => {
      if (valid(response)) {
        return response.data.spec
      }
    }
  )
  return res
}
