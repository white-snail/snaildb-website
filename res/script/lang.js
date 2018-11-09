var lang = {
	en: [],
	es: [],
	it: []
};

var language = {
	onchange: function(lang) {}
}

var currentLanguage;

function getLang(key) {
	if(lang[currentLanguage] && lang[currentLanguage][key]) return lang[currentLanguage][key];
	else return key;
}

function changeLanguage(l) {
	if(lang[l].length == 0) {
		var request = new XMLHttpRequest();
		request.onload = () => {
			lang[l] = JSON.parse(request.responseText);
			updateLanguage(l);
		}
		request.open("GET", `${window.location.origin}/lang/${l}.json`);
		request.send();
	} else {
		updateLanguage(l);
	}
}

function updateLang(langs) {
	for(var i=0; i<langs.length; i++) {
		var translation = getLang(langs[i].dataset.lang);
		if(langs[i].dataset.args) {
			const args = langs[i].dataset.args.split("|");
			for(var j in args) {
				translation = translation.replace("$" + j, getLang(args[j]));
			}
		}
		langs[i].innerText = translation;
	}
}

function updateLanguage(l) {
	currentLanguage = l;
	updateLang(document.getElementsByClassName("lang"));
	language.onchange();
}

window.addEventListener("load", () => {
	//TODO from cookie
	var language = window.navigator.language.substr(0, 2);
	if(lang[language]) changeLanguage(language);
	else changeLanguage("en");
});
