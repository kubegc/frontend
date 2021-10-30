// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences
import { getResource } from '@/api/kubernetes'

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
