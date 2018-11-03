//const API = "http://localhost:8080/";
const API = "http://snaildb.org:8080/";

function get(uri, callback) {
	var request = new XMLHttpRequest();
	request.onload = () => callback(JSON.parse(request.responseText));
	request.onerror = () => {
		document.title = getLang("error");
		showSection("error");
	};
	request.open("GET", API + uri);
	request.send();
}

function post(uri, params, callback) {
	var request = new XMLHttpRequest();
	request.onload = () => callback(JSON.parse(request.responseText));
	request.onerror = () => {
		document.title = getLang("error");
		showSection("error");
	};
	request.open("POST", API + uri);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.send(params);
}

function go(uri) {
	history.pushState({}, "", uri);
	updateUri();
}

function setTitle(title, translation) {
	document.title = title + " - The Snail Database";
	document.getElementById("title").innerText = title;
	if(translation) {
		language.onchange = () => {
			title = getLang(translation);
			document.title = title + " | The Snail Database";
			document.getElementById("title").innerText = title;
		};
	} else {
		language.onchange = () => {};
	}
}

function hideSections() {
	var sections = document.getElementsByTagName("section");
	for(var i=0; i<sections.length; i++) sections[i].style.display = "";
}

function showLoader() {
	hideSections();
	document.getElementById("loading").style.display = "block";
}

function showSection(id) {
	hideSections();
	document.getElementById(id).style.display = "block";
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function handleLinkClick(event) {
	if(this.href.startsWith(window.location.origin)) {
		event.preventDefault();
		go(this.href);
	}
}

function registerAllLinks() {
	var links = document.getElementsByTagName("a");
	for(var i=0; i<links.length; i++) {
		console.log(links[i]);
		links[i].onclick = handleLinkClick;
	}
}

function create(type, content, lang) {
	var ret = document.createElement(type);
	if(content != undefined) ret.innerHTML = content;
	if(lang != undefined) {
		ret.classList.add("lang");
		ret.dataset.lang = lang;
	}
	return ret;
}

function createLink(content, uri) {
	var a = document.createElement("a");
	a.innerText = content;
	a.href = uri;
	a.onclick = handleLinkClick;
	return a;
}

function registerSearch() {
	var searches = document.getElementsByClassName("search");
	for(var i=0; i<searches.length; i++) {
		searches[i].onkeydown = syncSearch;
		searches[i].onkeyup = syncSearch;
	}
}

function syncSearch(event) {
	const value = event.target.value;
	var searches = document.getElementsByClassName("search");
	for(var i=0; i<searches.length; i++) {
		searches[i].value = value;
	}
}

function search(event) {
	event.preventDefault();
	console.log(event.target.getElementsByTagName("input")[0].value);
}
