const ava = require('ava')
const {join} = require('path')
const JsEvalConfineRuntime = require('../index.js')

ava('Basic', async t => {
  const runtime = new JsEvalConfineRuntime(join(__dirname, 'programs', 'basic.js'))
  await runtime.init()
  await runtime.run()
  t.pass()
})

ava('Classes', async t => {
  const runtime = new JsEvalConfineRuntime(join(__dirname, 'programs', 'classes.js'))
  await runtime.init()
  await runtime.run()
  t.pass()
})

ava('Require', async t => {
  const runtime = new JsEvalConfineRuntime(join(__dirname, 'programs', 'require.js'))
  await runtime.init()
  await runtime.run()
  t.pass()
})