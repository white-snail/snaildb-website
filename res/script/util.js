const API = "http://localhost:8080/";

function get(uri, callback) {
	var request = new XMLHttpRequest();
	request.onload = () => callback(JSON.parse(request.responseText));
	request.open("GET", API + uri);
	request.send();
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

function create(type, content, uri, lang) {
	var ret = document.createElement(type);
	if(content != undefined) ret.innerHTML = content;
	if(uri != undefined) ret.onclick = () => go(uri);
	if(lang != undefined) {
		ret.classList.add("lang");
		ret.dataset.lang = lang;
	}
	return ret;
}
