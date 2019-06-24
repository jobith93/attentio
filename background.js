// background JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

//App URL
var appURL = 'http://localhost:3002'	// local
var appURL = 'http://206.189.136.1:3002'	// digitalocean

var socket = io(appURL)


chrome.runtime.onInstalled.addListener(function() {

	socket.on('ping user', function(data){

		chrome.notifications.getAll((notifications) => {
			for (const notification in notifications) {
				chrome.notifications.clear(notification)
			}
		})
		chrome.storage.sync.get('username', function(val) {
			if(val.username != data.sender.username)
				chrome.notifications.create(
					`ping user ${data.sender.username} to ${data.receiver.username}`,
					{   
						type    : 'basic',
						priority: 2,
						silent  : false,
						iconUrl : 'images/icons/attentio128.png',
						title   : `Hey ${data.sender.name}!`,
						message : `${data.receiver.name} wishes to grab your attention!`,
		
					}
				)
		})
		
	})

	chrome.storage.sync.get('username', function(val) {
		if(!val) chrome.storage.sync.set({username: 'sam'})
	})

	

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

	// listen for when someone clicks the page action
	chrome.pageAction.onClicked.addListener( function () {
		// query the current tab on the current window
		chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
			alert('Show Action Button Clicked!')

			// exceute the main.js script on this tab
			// chrome.tabs.executeScripts(
			// 	tabs[0].id, 
			// 	{ file: 'main.js' }
			// )
		})
	})

})
