// Default exports

export default {
    getCredentials: function () {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        return { username, password };
    },
    setCredentials: function (username, password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        return { username, password };
    },
    checkOwnCredentials: function () {
        const { username, password } = this.getCredentials();
        console.log(username, password);
        return this.checkCredentials(username, password);
    },
    checkCredentials: function (username, password) {
        return username === 'admin' && password === 'password';
    },
    clearCredentials: function () {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }
}