var data = {
	snails: {
		all: false,
		superfamily: {}
	}
};

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
	
	if(window.location.pathname == "" || window.location.pathname == "/") {
		// index page
		setTitle(getLang("welcome"), "welcome");
		showSection("index");
	} else {
		var s = window.location.pathname.split("/");
		while(s[s.length-1].length == 0) s.pop();
		switch(s[1]) {
			case "snail":
				function handleImpl(result) {
					if(result.result) {
						return true;
					} else {
						notFound();
						return false;
					}
				}
				if(s.length > 2) {
					var superfamily = s[2];
					if(s.length > 3) {
						var family = s[3];
						if(s.length > 4) {
							var genus = s[4];
							if(s.length > 5) {
								var species = s[5];
								// species
								function handle(result) {
									if(handleImpl(result)) {
										setData(result.result, "snails", "superfamily", superfamily, "family", family, "genus", genus, "species", species);
										data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies.sort((a, b) => a.name.localeCompare(b.name));
										displaySpecies(superfamily, family, genus, species);
									}
								}
								showLoader();
								if(getData("snails", "superfamily", superfamily, "family", family, "genus", genus, "species", species)) {
									if(data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies) displayGenus(superfamily, family, genus, species);
									else get("getsnailbyid/species/" + data.snails.superfamily[superfamily].family[family].genus[genus].species[species].id, handle);
								} else {
									get(`getsnailbyname/${superfamily}/${family}/${genus}/${species}`, handle);
								}
							} else {
								// genus
								function handle(result) {
									if(handleImpl(result)) {
										setData(result.result, "snails", "superfamily", superfamily, "family", family, "genus", genus);
										data.snails.superfamily[superfamily].family[family].genus[genus].species.sort((a, b) => a.name.localeCompare(b.name));
										displayGenus(superfamily, family, genus);
									}
								}
								showLoader();
								if(getData("snails", "superfamily", superfamily, "family", family, "genus", genus)) {
									if(data.snails.superfamily[superfamily].family[family].genus[genus].species) displayGenus(superfamily, family, genus);
									else get("getsnailbyid/genus/" + data.snails.superfamily[superfamily].family[family].genus[genus].id, handle);
								} else {
									get(`getsnailbyname/${superfamily}/${family}/${genus}`, handle);
								}
							}
						} else {
							// family
							function handle(result) {
								if(handleImpl(result)) {
									setData(result.result, "snails", "superfamily", superfamily, "family", family);
										data.snails.superfamily[superfamily].family[family].genuses.sort((a, b) => a.name.localeCompare(b.name));
									displayFamily(superfamily, family);
								}
							}
							showLoader();
							if(getData("snails", "superfamily", superfamily, "family", family)) {
								if(data.snails.superfamily[superfamily].family[family].genuses) displayFamily(superfamily, family);
								else get("getsnailbyid/family/" + data.snails.superfamily[superfamily].family[family].id, handle);
							} else {
								get(`getsnailbyname/${superfamily}/${family}`, handle);
							}
						}
					} else {
						// superfamily
						function handle(result) {
							if(handleImpl(result)) {
								data.snails.superfamily[superfamily] = result.result;
										data.snails.superfamily[superfamily].families.sort((a, b) => a.name.localeCompare(b.name));
								displaySuperfamily(superfamily);
							}
						}
						showLoader();
						if(data.snails.superfamily[superfamily]) {
							if(data.snails.superfamily[superfamily].families) displaySuperfamily(superfamily);
							else get("getsnailbyid/superfamily/" + data.snails.superfamily[superfamily].id, handle);
						} else {
							get(`getsnailbyname/${superfamily}`, handle);
						}
					}
				} else {
					// display all superfamilies
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
				}
				break;
			default:
				notFound();
		}
	}
	
	function notFound() {
		setTitle(getLang("notfound"), "notfound");
		showSection("notfound");
	}
	
}

window.addEventListener("load", registerAllLinks);
window.addEventListener("load", registerSearch);
window.addEventListener("load", updateUri);
window.onpopstate = updateUri;
