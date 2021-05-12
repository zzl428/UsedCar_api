const crypto = require('crypto');

const md5password = (pwd) => {
  const md5 = crypto.createHash('md5');
  const result = md5.update(pwd).digest('hex')
  return result
}

module.exports = md5password