module.exports = function User(firstName = 'unindentified', lastName = 'human') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.hasAccess = false;
    this.isLoggedIn = false;
    this.login = function () {
        if (this.hasAccess) {
            this.isLoggedIn = true;
            console.log('Access for user ' + this.firstName + ' ' + this.lastName + ' has been granted.' )
        }
        else console.log('user ' + this.firstName + ' ' + this.lastName + ' has no access rights.');
    }
    this.logout = () => this.isLoggedIn = false;

    this.toString = function () {
        return 'first name: ' + this.firstName + '\nlast name: ' + this.lastName + '\nAdmin: ' + this.hasAccess + '\nlogged in: ' + this.isLoggedIn;
    }
}