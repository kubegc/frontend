// import defaultSettings from '@/settings'
import { getResource } from '@/api/kubernetes'

// const title = defaultSettings.title || 'admin'
export default function getTitle(doc) {
  getResource({
    token: 'default',
    kind: 'Frontend',
    namespace: 'default',
    name: 'frontend-project'
  }).then((response) => {
    doc.title = response.data.spec.data[0].label
  })
}

// export default function getPageTitle(pageTitle) {
//   if (pageTitle) {
//     return `${pageTitle} - ${title}`
//   }
//   return `${title}`
// }
