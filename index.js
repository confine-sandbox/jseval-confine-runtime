const _eval = require('eval')
const { AbstractConfineRuntime, APIDescription, APIObject, APIMethod, MethodNotFound } = require('abstract-confine-runtime')
const _get = require('lodash.get')

module.exports = class JsEvalConfineRuntime extends AbstractConfineRuntime {
  constructor (opts) {
    super(opts)
    this.vmExports = {}
  }

  async init () {
    this.sandbox = {
      process: Object.assign({}, process, {
        exit: (code) => {
          this.emit('closed', code || 0)
        }
      }),
      ...this.opts.globals
    }
  }

  async run () {
    this.vmExports = _eval(this.source.toString('utf-8'), undefined, this.sandbox, true)
  }

  async close () {
  }

  describeAPI () {
    return new APIDescription(toAPIDescription(this.vmExports || {}))
  }

  async handleAPICall (methodName, params) {
    const method = _get(this.vmExports, methodName)
    if (typeof method === 'function') {
      return await method(...(params || []))
    } else {
      throw new MethodNotFound(`Method not found: ${methodName}`)
    }
  }
}

function toAPIDescription (obj) {
  const items = []
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'function') {
      items.push(new APIMethod(key))
    } else if (value && typeof value === 'object') {
      items.push(new APIObject(key, toAPIDescription(value)))
    }
  }
  return items
}