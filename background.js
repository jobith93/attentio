// background JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

//App URL
var appURL = 'http://localhost:3002'	// local
var appURL = 'http://206.189.136.1:3002'	// digitalocean

var socket = io(appURL)

function setup(){
	socket.on('ping user', function(data){

		chrome.notifications.getAll((notifications) => {
			for (const notification in notifications) {
				chrome.notifications.clear(notification)
			}
		})
		chrome.storage.sync.get('username', function(val) {
			if(val && val.username == data.receiver.username){
				
				fetch(data.sender.profile_picture)
					.then((resp) => resp.blob())
					.then(function(blob) {
						// play notification audio
						var notifyAudio = new Audio(chrome.runtime.getURL('audio/notify.mp3'));
						notifyAudio.play();
						// show notification
						chrome.notifications.create(
							`ping user ${data.sender.username} to ${data.receiver.username}`,
							{   
								type    : 'basic',
								priority: 2,
								silent  : false,
								iconUrl : URL.createObjectURL(blob),
								title   : `Hey ${data.receiver.name}!`,
								message : `${data.sender.name} wishes to grab your attention!`,
							}
						)
					})
					.catch(function(error) {
						// If there is any error you will catch them here
						console.log('error', error);
						
					}); 
				
			}
				
		})
		
	})

	chrome.storage.sync.get('username', function(val) {
		if(!val) chrome.storage.sync.set({username: 'sam'})
	})
}


chrome.runtime.onInstalled.addListener(function() {

	setup()

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){

		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [new chrome.declarativeContent.PageStateMatcher({
						pageUrl: {
							// hostEquals: 'www.google.com'
							schemes: ['https', 'http', 'chrome', 'file']
						},
					})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		])

	})

})

chrome.runtime.onStartup.addListener(function () {
	if(!socket.connected){
		chrome.runtime.reload()
		console.log('reload')
	}
	else{
		console.log('already connected')
		setup()
	}
})
