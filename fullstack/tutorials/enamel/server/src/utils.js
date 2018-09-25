const jwt = require('jsonwebtoken')

require('dotenv').config()

// 요청 정보에서 인증 토큰을 찾아서 검증
function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const {id} = jwt.verify(token, process.env.JWT_SECRET)
    return id
  }
  throw new Error('Not authenticated')
}

module.exports = {
  getUserId,
}