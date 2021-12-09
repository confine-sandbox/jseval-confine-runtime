exports.onrequest = async (msg) => {
  if (msg.method === 'succeed') {
    return {isGood: true}
  }
  if (msg.method === 'pingMe') {
    const res = await request({method: 'pongMe'})
    return {isGood: true}
  }
  throw new Error('Undefined method')
}