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

function createLangArgs(type, lang, args) {
	var p = create(type);
	p.className = "lang";
	p.dataset.lang = lang;
	p.dataset.args = args;
	updateLang([p]);
	return p;
}

function registerSearch() {
	var searches = document.getElementsByClassName("search");
	for(var i=0; i<searches.length; i++) {
		searches[i].onkeydown = (event) => {
			if(event.keyCode == 13) search(event);
		};
	}
}

function search(event) {
	event.preventDefault();
	get("searchsnail?query=" + document.getElementById("search").getElementsByTagName("input")[0].value, (d) => {
		var r = document.getElementById("searchresult");
		r.innerText = "";
		for(var key in d) {
			const result = d[key];
			if(key.endsWith("cies")) key += "-p";
			var title = create("p");
			title.appendChild(create("b", getLang(key), key));
			title.appendChild(create("b", ` (${result.length})`));
			r.appendChild(title);
			if(result.length > 0) {
				result.sort((a, b) => a.name.localeCompare(b.name));
				for(var i in result) {
					const res = result[i];
					r.appendChild((() => {
						switch(key) {
							case "superfamilies":
								return createLink(capitalize(res.name), `/snail/${res.name}`);
							case "families":
								return createLink(capitalize(res.name), `/snail/${res.superfamily}/${res.name}`);
							case "genera":
								return createLink(capitalize(res.name), `/snail/${res.superfamily}/${res.family}/${res.name}`);
							case "species-p":
								return createLink(capitalize(res.name) + ", " + capitalize(res.genus), `/snail/${res.superfamily}/${res.family}/${res.genus}/${res.name}`);
							case "subspecies-p":
								return createLink(capitalize(res.name) + ", " + capitalize(res.genus) + " " + capitalize(res.species), `/snail/${res.superfamily}/${res.family}/${res.genus}/${res.species}#${res.name}`);
						}
					})());
				}
			}
		}
	});
}
