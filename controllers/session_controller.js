// GET /login
exports.new = function (req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', { errors: errors });
};

// POST /login
exports.create = function (req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.authenticate(login, password, function(error, user) {
    if (error) {
      req.session.errors = [{ 'message': error.toString().slice(7) }];
      res.redirect('/login');
      return;
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect(req.session.redir);
  });
};

// DELETE /logout
exports.delete = function (req, res) {
  delete req.session.user;
  res.redirect(req.session.redir);
};
