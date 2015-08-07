var users = { admin: { id: 1, username: 'admin', password: '1234' } };

exports.authenticate = function (login, password, callback) {
  if (users[login]) {
    if (password === users[login].password) {
      callback(null, users[login]);
    }
    else {
      callback(new Error('Password incorrecto para el usuario "' + login + '"'));
    }
  }
  else {
    callback(new Error('No existe el usuario "' + login + '"'));
  }
};
