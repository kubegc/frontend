export function getMonitorInfo(kind, nodeName, podName) {
  let monitor_rs
  var prefix
  var startTimestamp = new Date().getTime() - 5 * 60 * 1000
  var node_prefix = 'http://' + window.g.VUE_APP_MONITOR_HOST_GRAFANA + '/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=' + nodeName + '&from=' + startTimestamp + '&to=' + new Date().getTime() + '&panelId='
  var pod_prefix = 'http://' + window.g.VUE_APP_MONITOR_HOST_GRAFANA + '/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=' + nodeName + '&var-Pod=' + podName + '&from=' + startTimestamp + '&to=' + new Date().getTime() + '&panelId='
  var testcase_prefix = 'http://' + window.g.VUE_APP_MONITOR_HOST_GRAFANA + '/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?refresh=5s&orgId=1&from=' + startTimestamp + '&to=' + new Date().getTime() + '&panelId=77&var-interval=%24__auto_interval_interval&var-datasource=Prometheus&var-Node=All'

  if (kind === 'Node') {
    prefix = node_prefix
    monitor_rs = {
      'cpu': prefix + '57',
      'memory': prefix + '65',
      'fs': prefix + '73',
      'network': prefix + '63'
    }
  } else if (kind === 'Container') {
    prefix = pod_prefix
    monitor_rs = {
      'cpu': prefix + '17',
      'memory': prefix + '25',
      'fs': prefix + '78',
      'network': prefix + '32'
    }
  } else if (kind === 'virtualmachine') {
    prefix = pod_prefix
    monitor_rs = {
      'cpu': prefix + '47',
      'memory': prefix + '42',
      'fs': prefix + '51',
      'network': prefix + '52'
    }
  } else if (kind === 'TestCase') {
    prefix = testcase_prefix
    return prefix
  }

  // var monitor_rs = {
  //   "cpu": prefix + "17",
  //   "memory": prefix + "25",
  //   "fs": prefix + "17",
  //   "network":prefix + "17",
  // }
  return monitor_rs
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
  return 'http://124.70.64.232:31003/superset/welcome/'
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
      return document.location.href()
  }
}

