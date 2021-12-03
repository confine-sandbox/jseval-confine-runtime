const fs = require('fs').promises
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
    ;(1, eval)(this.scriptSource)
    // the above oddity is known as an "indirect" eval. It causes the eval() to run in the global scope.
  }

  async close () {
  }
}