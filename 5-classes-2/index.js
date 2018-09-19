const User = require('./user.class');
const Admin = require('./admin.class');

user = new User('John', 'Lennon');
user.login();
console.log('Simple user.\n' + user);

admin = new Admin('Paul', 'McCartney');
admin.login();
console.log('Admin user.\n' + admin);