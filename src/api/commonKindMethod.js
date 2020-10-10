//connect vm&container's terminal
export function connectTerminal(kind,row) {
    var name = row.json.metadata.name
    
    console.log(kind)
    if (kind == "Pod") {
        var namespace = row.json.metadata.namespace
        return "http://" +
            window.g.VUE_APP_CONTAINER_HOST +
            ":7002?host=" +
            window.g.VUE_APP_CONTAINER_HOST + ":8888" +
            "&podName=" +
            name +
            "&namespace=" +
            namespace
        
    } else if (kind == "VirtualMachine") {
        window.open("http://" + window.g.VUE_APP_VNCHOST + ":6080/vnc.html?path=websockify/?token=" + name)
    } else if(kind == "Node") {
        var ip = row.json.status.addresses[0].address
        window.open("http://" + window.g.VUE_APP_CONTAINER_HOST + ":7001/ssh/host/" + ip)
    }
    return 0
}
