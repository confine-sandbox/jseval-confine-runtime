const fs = require('fs').promises
const _eval = require('eval')
const AbstractConfineRuntime = require('abstract-confine-runtime')

module.exports = class JsEvalConfineRuntime extends AbstractConfineRuntime {
  constructor (sourcePath, opts) {
    super(sourcePath, opts)
    this.scriptSource = undefined
  }

  async init () {
    console.log(this.sourcePath)
    this.scriptSource = await fs.readFile(this.sourcePath, 'utf-8')
  }

  async run () {
    _eval(this.scriptSource, undefined, undefined, true)
  }

  async close () {
  }
}