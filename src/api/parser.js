export function getInputValue(scope, key) {
  if (JSON.stringify(scope) === '{}' || !key) {
    return ''
  }
  var value = ''
  var strArry = key.split('+')
  for (let i = 0; i < strArry.length; i++) {
    var longKey = strArry[i]
    if (strArry.length === 2) {
      var v = getValue(scope, longKey)
      var k = v.indexOf('/')
      if (k !== -1) {
        value = value + '.' + v.substring(0, k)
      } else {
        value = value + '.' + v
      }
    } else {
      value = value + '.' + getValue(scope, longKey)
    }
  }
  return value.substring(1)
}
export function getValue(scope, longKey) {
  if (JSON.stringify(scope) === '{}' || !longKey) {
    return ''
  }
  if (longKey.indexOf('.') === -1) {
    return scope[longKey]
  }
  const keys = longKey.split('.')
  let res = scope
  keys.every((item) => {
    if (item.indexOf('[') > 0) {
      res = res[item.substring(0, item.indexOf('['))]
      if (res === undefined || res.length === 0) {
        res = 'unknown'
        return false
      } else {
        res =
          res[
            parseInt(
              item.substring(item.indexOf('[') + 1, item.indexOf(']'))
            )
          ]
        return true
      }
    } else {
      // todo 这里代码有问题，if走不到
      if (res && res[item] !== undefined) {
        res = res[item]
        return true
      } else {
        res = '无'
        return false
      }
    }
  })

  return res
}
export function updateJsonObj(jsonObj, configArray) {
  let jsonObjTemp
  let propertiesRequired
  for (const key in configArray) {
    // 如果 id 是长长的一串
    // 例如 ...,...,... 这种，就将这个长字符串按 ','  分成字符串数组 ['...','...','...']
    if (configArray[key].id.indexOf(',') > 0) {
      propertiesRequired = configArray[key].id.split(',')
    } else {
      propertiesRequired = []
      propertiesRequired.push(configArray[key].id)
    }
    // 这里是针对每一个属性进行一个循环
    for (let j = 0; j < propertiesRequired.length; j++) {
      jsonObjTemp = jsonObj
      const pathToProperty = propertiesRequired[j].split('.')
      // pathToProperty 数组中最后一个元素是我们的目标属性，所以要解析前面的中间属性
      for (let i = 0; i < pathToProperty.length - 1; i++) {
        if (pathToProperty[i].indexOf('[') > 0) {
          // 获得 example[index] 的 example 数组对象
          jsonObjTemp =
            jsonObjTemp[
              pathToProperty[i].substring(0, pathToProperty[i].indexOf('['))
            ]
          // 获得 example 数组对象里面的 index 索引下的对象
          jsonObjTemp =
            jsonObjTemp[
              parseInt(
                pathToProperty[i].substring(
                  pathToProperty[i].indexOf('[') + 1,
                  pathToProperty[i].indexOf(']')
                )
              )
            ]
        } else {
          jsonObjTemp = jsonObjTemp[pathToProperty[i]]
        }
      }
      // 处理目标属性，是 example 这种 还是 exapmle[index] 这种
      if (pathToProperty[pathToProperty.length - 1].indexOf('[') > 0) {
        jsonObjTemp =
          jsonObjTemp[
            pathToProperty[pathToProperty.length - 1].substring(
              0,
              pathToProperty[pathToProperty.length - 1].indexOf('[')
            )
          ]
        if (configArray[key].type === 'integer') {
          jsonObjTemp[
            parseInt(
              pathToProperty[pathToProperty.length - 1].substring(
                pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                pathToProperty[pathToProperty.length - 1].indexOf(']')
              )
            )
          ] = Number(configArray[key].value) // 这里的 value 就是用户填写的信息
        } else {
          jsonObjTemp[
            parseInt(
              pathToProperty[pathToProperty.length - 1].substring(
                pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                pathToProperty[pathToProperty.length - 1].indexOf(']')
              )
            )
          ] = configArray[key].value
        }
      } else if (configArray[key].type === 'integer') {
        jsonObjTemp[
          pathToProperty[pathToProperty.length - 1]
        ] = Number(configArray[key].value)
      } else {
        jsonObjTemp[
          pathToProperty[pathToProperty.length - 1]
        ] = configArray[key].value
      }
    }
  }
}
