const ava = require('ava')
const {join} = require('path')
const fs = require('fs').promises
const JsEvalConfineRuntime = require('../index.js')

function makeGlobals () {
  const logs = []
  const errors = []
  const globals = {
    console: {
      log: (...args) => logs.push(args),
      error: (...args) => errors.push(args)
    }
  }
  return {
    globals,
    logs,
    errors
  }
}

ava('Basic', async t => {
  const {globals, logs, errors} = makeGlobals()
  const source = await fs.readFile(join(__dirname, 'programs', 'basic.js'))
  const runtime = new JsEvalConfineRuntime({source, globals})
  await runtime.init()
  await runtime.run()
  t.deepEqual(logs, [['hello, world']])
  t.deepEqual(errors, [['hello, error']])
})

ava('Classes', async t => {
  const {globals, logs, errors} = makeGlobals()
  const source = await fs.readFile(join(__dirname, 'programs', 'classes.js'))
  const runtime = new JsEvalConfineRuntime({source, globals})
  await runtime.init()
  await runtime.run()
  t.deepEqual(logs, [['Hello from MyClass']])
})

ava('Require', async t => {
  const {globals, logs, errors} = makeGlobals()
  const source = await fs.readFile(join(__dirname, 'programs', 'require.js'))
  const runtime = new JsEvalConfineRuntime({source, globals})
  await runtime.init()
  await runtime.run()
  t.deepEqual(logs, [['string']])
})

ava('Exports', async t => {
  const {globals, logs, errors} = makeGlobals()
  const source = await fs.readFile(join(__dirname, 'programs', 'exports.js'))
  const runtime = new JsEvalConfineRuntime({source, globals})
  await runtime.init()
  await runtime.run()
  const res1 = await runtime.handleAPICall('ping', [5])
  t.is(res1.pong, 5)
})

ava('Self close', async t => {
  const {globals, logs, errors} = makeGlobals()
  const source = await fs.readFile(join(__dirname, 'programs', 'selfclose.js'))
  const runtime = new JsEvalConfineRuntime({source, globals})
  let exitCode = undefined
  runtime.on('closed', _exitCode => { exitCode = _exitCode })
  await runtime.init()
  await runtime.run()
  t.deepEqual(logs, [['self closing']])
  t.is(exitCode, 1)
})