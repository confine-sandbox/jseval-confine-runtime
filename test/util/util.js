module.exports.fakeIpc = () => {
  const messages = []
  const ipc = {messages}
  ipc.request = (cid, body) => messages.push({type: 'request', cid, body})
  ipc.notify = (cid, body) => messages.push({type: 'notify', cid, body})
  return ipc
}