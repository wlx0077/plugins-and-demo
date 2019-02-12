//状态常量
const REJECTED = 'rejected'
const FULFILLED = 'fulfilled'
const PENDING = 'pending'

const isFunction = fn => typeof fn === 'function'

class Promise {
  constructor (fn) {
    this.value = null  // 满足结果
    this.reason = null  // 被拒结果
    this.status = PENDING   // 实例状态
    this.fulfulledCallbacks = []   // 满足结果后处理value的回调
    this.rejectedCallbacks = []   // 被拒后处理reason的回调

    // 更新自身value及status, 跳到下一个实例的resolve调用栈 (关键)
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
        this.fulfulledCallbacks.forEach(cb => cb(value))
      }
    }

    // 被拒后处理,同resolve
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.rejectedCallbacks.forEach(cb => cb(reason))
      }
    }

    // 暴露resolve及reject
    try {
      isFunction(fn) && fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  //返回promise实例
  then (fulfilledCb, rejectedCb) {
    return new Promise((resolve, reject) => {
      // 封装fulfilledCb
      const onResolvedFade = (value) => {
        try {
          // 得到阶段结果
          let result = isFunction(fulfilledCb) ? fulfilledCb(value) : value
          // 存储阶段结果, 并跳转
          if (result instanceof Promise) {
            return result.then(res => resolve(res))
          }
          resolve(result)
        } catch (e) {
          reject(e)
        }
      }

      // 封装rejectedCb, 同onResolveFade
      const onRejectedFade = (reason) => {
        try {
          let error = isFunction(rejectedCb) ? fulfilledCb(reason) : reason
          if (error instanceof Promise) {
            return error.then(null, err => reject(err))
          }
          reject(error)
        } catch (e) {
          reject(e)
        }
      }

      // pending状态, 未产生结果, 可以添加待执行回调
      if (this.status === PENDING) {
        this.fulfulledCallbacks.push(onResolvedFade)
        this.rejectedCallbacks.push(onRejectedFade)
      }

      // 已产生结果, 前一个resolve已经执行, 无法跳转到下一个resolve, 需要手动执行回调
      if (this.status === FULFILLED) {
        onResolvedFade(this.value)
      }

      if (this.status === REJECTED) {
        onRejectedFade(this.reason)
      }
    })
  }

  // resolve及callback产生的错误将在这里最终处理
  catch (errHandler) {
    if (!isFunction(errHandler)) return

    if (this.status === PENDING) {
      this.rejectedCallbacks.push(err => {
        errHandler(err)
      })
    }
    if (this.status === REJECTED) {
      errHandler(this.reason)
    }
  }
}

module.exports = Promise