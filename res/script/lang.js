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
	else return '';
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

function updateLanguage(l) {
	currentLanguage = l;
	var langs = document.getElementsByClassName("lang");
	for(var i=0; i<langs.length; i++) {
		langs[i].innerText = lang[l][langs[i].dataset.lang];
	}
	language.onchange();
}

window.addEventListener("load", () => {
	//TODO from cookie
	var language = window.navigator.language.substr(0, 2);
	if(lang[language]) changeLanguage(language);
	else changeLanguage("en");
});
