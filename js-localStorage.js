;(function (w) {
  w.myStore = {}
  w.myStore.namespace = 'myLocalStorage'

  let namespace = w.myStore.namespace

  let getData = function () {
    return JSON.parse(localStorage.getItem(namespace))
  }
  let saveData = function (data) {
    localStorage.setItem(namespace, JSON.stringify(data))
  }
  let removeStorage = function () {
    localStorage.removeItem(namespace)
  }

  w.myStore.set = function (key, val) {
    let data = getData() || {}
    data[key] = val
    saveData(data)
  }

  w.myStore.get = function (key) {
    let data = getData()
    return key ? data[key] : data
  }

  w.myStore.remove = function (key) {
    if (!key) {
      return removeStorage()
    }
    let data = getData()
    delete data[key]
    Object.keys(data).length ? saveData(data) : removeStorage()
  }

}(window))