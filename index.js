const _eval = require('eval')
const AbstractConfineRuntime = require('abstract-confine-runtime')
const {pack, unpack} = require('msgpackr')

module.exports = class JsEvalConfineRuntime extends AbstractConfineRuntime {
  constructor (opts) {
    super(opts)
    this.vmExports = {}
  }

  async init () {
    this.sandbox = {
      console: {
        log: (...args) => this.ipc.notify(0, pack({method: '__console_log', params: {stderr: false, data: args.join(' ')}})),
        error: (...args) => this.ipc.notify(0, pack({method: '__console_log', params: {stderr: true, data: args.join(' ')}})),
        warn: (...args) => this.ipc.notify(0, pack({method: '__console_log', params: {stderr: true, data: args.join(' ')}}))
      },
      process: Object.assign({}, process, {
        exit: (code) => {
          this.emit('closed', code || 0)
        }
      }),
      request: (body) => this.ipc.request(0, pack(body)),
      notify: (body) => this.ipc.notify(0, pack(body))
    }
  }

  async run () {
    this.vmExports = _eval(this.source.toString('utf-8'), undefined, this.sandbox, true)
  }

  async close () {
  }

  async handleRequest (body) {
    if (typeof this.vmExports.onrequest === 'function') {
      try {
        return pack(await this.vmExports?.onrequest(unpack(body)))
      } catch (e) {
        throw pack({message: e.message || e.toString()})
      }
    } else {
      throw pack({message: 'No request handler defined'})
    }
  }
}