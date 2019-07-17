// pop JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

const username = document.getElementById('user-name')
const userimage = document.getElementById('user-image')
const team_list = document.getElementById('team-members')
const users_list = document.getElementById('select-user')
const optionsBtn = document.getElementById('open-options')
const reloadBtn = document.getElementById('open-reload')
const version = document.getElementById('version')

// getting values from background JS
var background = chrome.extension.getBackgroundPage();
var socket = background.window['socket']
console.log(background.window);

const url = `${background.window['appURL']}/users`




function createNode(element, className) {
	// Create the type of element you pass in the parameters
	let el = document.createElement(element)
	el.className = className
	return el
}

function append(parent, el) {
	// Append the second parameter(element) to the first one
	return parent.appendChild(el) 
}

function fetchTeam(url){
	fetch(url)
	.then((resp) => resp.json())
	.then(function(data) {
		// let users = JSON.parse(data)

		// Get user from team members
		chrome.storage.sync.get('username', function(storageValue) {

			// Get the team members
			team_list.innerHTML = '';
			users_list.innerHTML = '';
			let team_members = data.users;
			return team_members.map(function(member) { 

				// Map through the results and for each run the code below
				if(storageValue.username != member.username){
					//  Create the elements we need
					let figure = createNode('figure', `member ${member.status}`)
					let	img = createNode('img', 'profile')
					let	figcaption = createNode('figcaption', 'name')
					// Add the source of the image to be the src of the img element
					img.src = member.profile_picture;  
					// Make the HTML of our span to be the first and last name of our member
					figcaption.innerHTML = `${member.name}`;

					figure.setAttribute('data-username', member.username);
					figure.addEventListener('click', function(event) {

						let el = event.target
						if (!event.target.hasAttribute('data-username')){
							// console.log(event.target.parentNode);
							el = event.target.parentNode
						}
						
						if(socket.connected){
							console.log('Socket is connected ✅')
							socket.emit('ping user', { sender: storageValue.username, receiver: el.getAttribute('data-username') });
						}
						else{
							console.log('Socket is disconnected 💀')
							chrome.runtime.reload()
						}

					});
					// Append all our elements
					append(figure, img); 
					append(figure, figcaption);
					append(team_list, figure);

					let ufigure = createNode('figure', 'user')
					let	uimg = createNode('img', 'profile')
					let	ufigcaption = createNode('figcaption', 'name')
					// Add the source of the image to be the src of the img element
					uimg.src = member.profile_picture;  
					// Make the HTML of our span to be the first and last name of our member
					ufigcaption.innerHTML = `${member.name}`;

					ufigure.setAttribute('data-username', member.username);
					ufigure.addEventListener('click', function(event) {

						let el = event.target
						if (!event.target.hasAttribute('data-username')){
							// console.log(event.target.parentNode);
							el = event.target.parentNode
						}
						
						chrome.storage.sync.set({username: el.getAttribute('data-username')}, function() {
							users_list.classList.toggle('open');
							fetchTeam(url)
						})
					});
					// Append all our elements
					append(ufigure, uimg); 
					append(ufigure, ufigcaption);
					append(users_list, ufigure);

				}
				else{
					username.innerHTML = member.name
					userimage.setAttribute('style', `background-image: url(${member.profile_picture})`)
				}
			})
		});
		
	})
	.catch(function(error) {
		// If there is any error you will catch them here
		console.log('error', error);
	}); 
}

fetchTeam(url)


optionsBtn.onclick = function(element) {
	users_list.classList.toggle('open');
};

reloadBtn.onclick = function(element) {
	chrome.runtime.reload();
};

version.innerHTML = chrome.runtime.getManifest().version;

