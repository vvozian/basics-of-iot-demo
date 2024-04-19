import auth from './common/auth.js';

if (auth.checkOwnCredentials()) window.location.href = '/app';

// Handler of submit button of login form
const onSubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!auth.checkCredentials(username, password)) {
        window.location.href = '/wrong_login';
    } else {

    auth.setCredentials(username, password);
    window.location.href = '/app';
    }
}

document.getElementById('submit-button').addEventListener('click', onSubmit);