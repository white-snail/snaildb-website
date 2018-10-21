var lang = {
	en: [],
	es: [],
	it: []
};

var currentLanguage;

function getLang(key) {
	if(lang[currentLanguage] && lang[currentLanguage][key]) return lang[currentLanguage][key];
	else return '';
}

function changeLanguage(language) {
	if(lang[language].length == 0) {
		var request = new XMLHttpRequest();
		request.onload = () => {
			lang[language] = JSON.parse(request.responseText);
			updateLanguage(language);
		}
		request.open("GET", `${window.location.origin}/lang/${language}.json`);
		request.send();
	} else {
		updateLanguage(language);
	}
}

function updateLanguage(language) {
	currentLanguage = language;
	var langs = document.getElementsByClassName("lang");
	for(var i=0; i<langs.length; i++) {
		langs[i].innerText = lang[language][langs[i].dataset.lang];
	}
}

window.addEventListener("load", () => {
	//TODO from cookie
	var language = window.navigator.language.substr(0, 2);
	if(lang[language]) changeLanguage(language);
	else changeLanguage("en");
});
