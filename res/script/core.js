var data = {
	snails: {
		all: false,
		superfamily: {}
	},
	taxonomers: {
		all: false,
		list: []
	}
};

var router;

function updateUri() {
	
	function getData(...args) {
		var d = data;
		while(args.length > 0) {
			if(d[args[0]] == undefined) return undefined;
			d = d[args.shift()];
		}
		return d;
	}
	
	function setData(value, ...args) {
		for(var i=1; i<args.length; i++) {
			if(eval("data." + args.slice(0, i).join(".") + " == undefined")) eval("data." + args.slice(0, i).join(".") + " = {}");
		}
		eval("data." + args.join(".") + " = value");
	}
	
	function notFound() {
		setTitle(getLang("notfound"), "notfound");
		showSection("notfound");
	}
	
	function handleImpl(result) {
		if(result.result) {
			return true;
		} else {
			notFound();
			return false;
		}
	}
	
	router = new Navigo(null);
	router.on(() => {
		// index page
		document.title = getLang("title");
		document.getElementById("title").innerText = getLang("title");
		language.onchange = () => {
			document.title = getLang("title");
			document.getElementById("title").innerText = getLang("title");
		};
		get("getinfo/total", (d) => {
			document.getElementById("superfamilies").innerText = d.superfamilies;
			document.getElementById("families").innerText = d.families;
			document.getElementById("genuses").innerText = d.genuses;
			document.getElementById("species").innerText = d.species;
		});
		get("getinfo/speciesnotextinct", (d) => {
			document.getElementById("living").dataset.args = d;
			if(language.loaded) updateLang([document.getElementById("living")]);
		});
		function displaySuperfamiliesIndex() {
			var list = document.getElementById("superfamilies-list");
			list.innerText = "";
			for(var key in data.snails.superfamily) {
				var div = create("div");
				div.appendChild(createLink(capitalize(key), `snail/${key}`));
				list.appendChild(div);
			}
		}
		if(data.snails.all) {
			displaySuperfamiliesIndex();
		} else {
			get("getallsnails/superfamilies", (d) => {
				for(var i in d) {
					data.snails.superfamily[d[i].name] = d[i];
				}
				data.snails.all = true;
				displaySuperfamiliesIndex();
			});
		}
		showSection("index");
	});
	router.on({
		"snail": () => {
			if(data.snails.all) {
				displaySuperfamilies();
			} else {
				showLoader();
				get("getallsnails/superfamilies", (d) => {
					for(var i in d) {
						data.snails.superfamily[d[i].name] = d[i];
					}
					data.snails.all = true;
					displaySuperfamilies();
				});
			}
		},
		"snail/:superfamily": (params) => {
			showLoader();
			const superfamily = params.superfamily.toLowerCase();
			function handle(result) {
				if(handleImpl(result)) {
					data.snails.superfamily[superfamily] = result.result;
					data.snails.superfamily[superfamily].families.sort((a, b) => a.name.localeCompare(b.name));
					displaySuperfamily(superfamily);
				}
			}
			if(getData("snails", "superfamily", superfamily, "id")) {
				if(data.snails.superfamily[superfamily].families) displaySuperfamily(superfamily);
				else get("getsnailbyid/superfamily/" + data.snails.superfamily[superfamily].id, handle);
			} else {
				get(`getsnailbyname/${superfamily}`, handle);
			}
		},
		"snail/:superfamily/:family": (params) => {
			showLoader();
			const superfamily = params.superfamily.toLowerCase();
			const family = params.family.toLowerCase();
			function handle(result) {
				if(handleImpl(result)) {
					setData(result.result, "snails", "superfamily", superfamily, "family", family);
					data.snails.superfamily[superfamily].family[family].genuses.sort((a, b) => a.name.localeCompare(b.name));
					displayFamily(superfamily, family);
				}
			}
			if(getData("snails", "superfamily", superfamily, "family", family, "id")) {
				if(data.snails.superfamily[superfamily].family[family].genuses) displayFamily(superfamily, family);
				else get("getsnailbyid/family/" + data.snails.superfamily[superfamily].family[family].id, handle);
			} else {
				get(`getsnailbyname/${superfamily}/${family}`, handle);
			}
		},
		"snail/:superfamily/:family/:genus": (params) => {
			showLoader();
			const superfamily = params.superfamily.toLowerCase();
			const family = params.family.toLowerCase();
			const genus = params.genus.toLowerCase();
			function handle(result) {
				if(handleImpl(result)) {
					setData(result.result, "snails", "superfamily", superfamily, "family", family, "genus", genus);
					data.snails.superfamily[superfamily].family[family].genus[genus].species.sort((a, b) => a.name.localeCompare(b.name));
					displayGenus(superfamily, family, genus);
				}
			}
			if(getData("snails", "superfamily", superfamily, "family", family, "genus", genus, "id")) {
				if(data.snails.superfamily[superfamily].family[family].genus[genus].species) displayGenus(superfamily, family, genus);
				else get("getsnailbyid/genus/" + data.snails.superfamily[superfamily].family[family].genus[genus].id, handle);
			} else {
				get(`getsnailbyname/${superfamily}/${family}/${genus}`, handle);
			}
		},
		"snail/:superfamily/:family/:genus/:species": (params) => {
			showLoader();
			const superfamily = params.superfamily.toLowerCase();
			const family = params.family.toLowerCase();
			const genus = params.genus.toLowerCase();
			const species = params.species.toLowerCase();
			function handle(result) {
				if(handleImpl(result)) {
					setData(result.result, "snails", "superfamily", superfamily, "family", family, "genus", genus, "speciess", species);
					data.snails.superfamily[superfamily].family[family].genus[genus].speciess[species].subspecies.sort((a, b) => a.name.localeCompare(b.name));
					displaySpecies(superfamily, family, genus, species);
				}
			}
			if(getData("snails", "superfamily", superfamily, "family", family, "genus", genus, "speciess", species)) {
				if(data.snails.superfamily[superfamily].family[family].genus[genus].speciess[species].subspecies) displaySpecies(superfamily, family, genus, species);
				else get("getsnailbyid/species/" + data.snails.superfamily[superfamily].family[family].genus[genus].speciess[species].id, handle);
			} else {
				get(`getsnailbyname/${superfamily}/${family}/${genus}/${species}`, handle);
			}
		},
		"taxonomer": () => {
			if(data.taxonomers.all) {
				displayTaxonomers();
			} else {
				showLoader();
				get("getalltaxonomers", (d) => {
					d.sort((a, b) => a.surname.toLowerCase().localeCompare(b.surname.toLowerCase()));
					data.taxonomers.list = d;
					displayTaxonomers();
				});
			}
		},
		"taxonomer/:taxonomer": (params) => {
			const taxonomer = params.taxonomer.toLowerCase();
			if(data.taxonomers[taxonomer]) {
				displayTaxonomer(taxonomer);
			} else {
				showLoader();
				get(`gettaxonomerbyname/${taxonomer}`, (d) => {
					if(d.result) {
						data.taxonomers[taxonomer] = d.result;
						displayTaxonomer(taxonomer);
					} else {
						notFound();
					}
				});
			}
		},
		"sources": () => {
			setTitle(getLang("sources"), "sources");
			showSection("sources")
		},
		"search": () => {
			//TODO
		}
	});
	router.notFound(notFound);
	router.resolve();
	
}

window.addEventListener("load", registerAllLinks);
window.addEventListener("load", registerSearch);
window.addEventListener("load", updateUri);
window.onpopstate = updateUri;

// graphical
function onresize() {
	const height = window.innerHeight - (document.getElementsByTagName("header")[0].offsetHeight + document.getElementsByTagName("footer")[0].offsetHeight) - 32;
	var sections = document.getElementsByTagName("section");
	for(var i=0; i<sections.length; i++) {
		sections[i].style.height = height + "px";
	}
}
window.addEventListener("load", () => {
	document.getElementById("open-menu").onclick = () => document.getElementById("sidebar").classList.add("open");
	document.getElementById("api-docs").href = document.getElementById("api-docs").innerText = API + "docs";
	document.getElementById("close-menu").onclick = () => document.getElementById("sidebar").classList.remove("open");
	document.body.onresize = onresize;
	onresize();
});
