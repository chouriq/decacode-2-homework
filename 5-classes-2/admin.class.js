const User = require('./user.class');

module.exports = function Admin() {
    User.apply(this, arguments);
    this.hasAccess = true;
};