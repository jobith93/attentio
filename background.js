// background JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

chrome.runtime.onInstalled.addListener(function() {

	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("Attentio is running...");
	});

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){

		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [new chrome.declarativeContent.PageStateMatcher({
						pageUrl: {hostEquals: 'developer.chrome.com'},
					})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);

	});

});
