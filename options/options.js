// options JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

let username = document.getElementById('username');
let usernameBtn = document.getElementById('updateUsername');

chrome.storage.sync.get('username', function(data) {
    username.value = data.username
});

usernameBtn.addEventListener('click', function() {
    chrome.storage.sync.set({username: username.value}, function() {
        console.log('username updated ' + username.value);
    })
});
