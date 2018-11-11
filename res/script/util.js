//const API = "http://localhost:8080/";
const API = "https://api.snaildb.org/";

function get(uri, callback) {
	if(uri == preload.uri) {
		callback(preload.data);
	} else {
		var request = new XMLHttpRequest();
		request.onload = () => callback(JSON.parse(request.responseText));
		request.onerror = () => {
			setTitle(getLang("error"), "error");
			showSection("error");
		};
		request.open("GET", API + uri);
		request.send();
	}
}

function go(uri) {
	history.pushState({}, "", uri);
	updateUri();
}

function setTitle(title, translation) {
	function parseTitle() {
		var content = "";
		const split = title.split(" ");
		for(var i in split) {
			content += "<span>" + split[i] + "</span>";
			content += "<span> </span>";
		}
		return content;
	}
	function set() {
		document.title = title + " - " + getLang("title");
		document.getElementById("title").innerHTML = parseTitle();
		onresize();
	}
	set();
	language.onchange = () => {
		title = translation ? getLang(translation) : title;
		set();
	};
}

function hideSections() {
	var sections = document.getElementsByTagName("section");
	for(var i=0; i<sections.length; i++) sections[i].style.display = "";
}

function showLoader() {
	hideSections();
	document.getElementById("loading").style.display = "block";
	document.title = "";
	document.getElementById("title").innerText = "...";
	language.onchange = () => {};
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
