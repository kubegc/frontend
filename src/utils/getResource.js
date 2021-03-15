export function getMonitorInfo(url, namespace, name) {
  // let monitor_rsmonitor_rs = {
  //   'cpu': prefix + '57'
  //   'memory': prefix + '65',
  //   'fs': prefix + '73',
  //   'network': prefix + '63'
  // }
  return ''
}

export function getGrafanaLink() {
  const startTimestamp = new Date().getTime() - 12 * 60 * 1000
  return 'http://' + window.g.VUE_APP_MONITOR_HOST_GRAFANA + '/d/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&from=' + startTimestamp + '&to=' + new Date().getTime()
}

export function getLokiLink() {
  const startTimestamp = new Date().getTime() - 12 * 60 * 1000
  return 'http://' + window.g.VUE_APP_MONITOR_HOST_GRAFANA + '/d-solo/2gSj9goGk/loki-logs-copy?orgId=1&refresh=1m&var-datasource=Loki&var-app=All&var-job=node&panelId=2&var-string=&from=' + startTimestamp + '&to=' + new Date().getTime()
}

export function getSupersetLink() {
  return 'http://124.70.64.232:31003/r/26'
}
export function getSourceLink(sourceName) {
  switch (sourceName) {
    case 'grafana':
      return getGrafanaLink()
    case 'loki':
      return getLokiLink()
    case 'superset':
      return getSupersetLink()
    default:
      return ''
  }
}

