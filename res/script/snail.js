function displaySuperfamilies() {
	var snail = clean();
	setTitle(getLang("list-superfamilies"), "list-superfamilies");
	for(var superfamily in data.snails.superfamily) {
		var d = data.snails.superfamily[superfamily];
		var div = create("div");
		div.appendChild(createLink(capitalize(d.name), `/snail/${d.name}`));
		taxonomers(d, div);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displaySuperfamily(superfamily) {
	var snail = clean();
	setTitle(capitalize(superfamily));
	addHeader(superfamily);
	for(var family in data.snails.superfamily[superfamily].families) {
		var d = data.snails.superfamily[superfamily].families[family];
		var div = create("div");
		div.appendChild(createLink(capitalize(d.name), `/snail/${superfamily}/${d.name}`));
		taxonomers(d, div);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayFamily(superfamily, family) {
	var snail = clean();
	setTitle(capitalize(family));
	addHeader(superfamily, family);
	for(var genus in data.snails.superfamily[superfamily].family[family].genuses) {
		var d = data.snails.superfamily[superfamily].family[family].genuses[genus];
		var div = create("div");
		div.appendChild(createLink(capitalize(d.name), `/snail/${superfamily}/${family}/${d.name}`));
		taxonomers(d, div);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayGenus(superfamily, family, genus) {
	var snail = clean();
	setTitle(capitalize(genus));
	addHeader(superfamily, family, genus);
	for(var species in data.snails.superfamily[superfamily].family[family].genus[genus].species) {
		var d = data.snails.superfamily[superfamily].family[family].genus[genus].species[species];
		var div = create("div");
		div.appendChild(createLink(capitalize(d.name), `/snail/${superfamily}/${family}/${genus}/${d.name}`));
		taxonomers(d, div);
		if(d.extinct) div.appendChild(create("span", "&nbsp;†"));
		snail.appendChild(div);
	}
	showSection("snail");
}

function displaySpecies(superfamily, family, genus, species) {
	setTitle(`${capitalize(genus)} ${capitalize(species)}`);
	var snail = clean();
	addHeader(superfamily, family, genus, species);
	var sp = data.snails.superfamily[superfamily].family[family].genus[genus].speciess[species];
	var p = create("p");
	p.className = "lang";
	p.dataset.lang = "species-desc" + (sp.extinct ? "-extinct" : "");
	p.dataset.args = [capitalize(genus) + " " + capitalize(species), sp.viviparous ? "viviparous" : "oviparous", sp.type + "-snail", capitalize(family)].join("|");
	updateLang([p]);
	snail.appendChild(p);
	var s = sp.subspecies;
	for(var subspecies in s) {
		var d = s[subspecies];
		var div = create("div");
		div.className = "subspecies";
		if(s.length != 1 || s[0].name != species) {
			div.appendChild(create("span", getLang("subspecies"), "subspecies"));
			div.appendChild(create("span", "&nbsp;"));
			div.appendChild(create("span", capitalize(d.name)));
			taxonomers(d, div);
		}
		var table = create("table");
		table.style.borderSpacing = "0";
		function add(title, content) {
			var tr = create("tr");
			var td1 = create("td");
			var td2 = create("td");
			td1.style.textAlign = "right";
			td1.appendChild(title);
			td2.appendChild(content);
			tr.appendChild(td1);
			tr.appendChild(td2);
			table.appendChild(tr);
		}
		if(d.minWidth || d.maxWidth) {
			add(create("span", getLang("width"), "width"), create("span", d.maxWidth==undefined||d.maxWidth==d.minWidth ? `~${d.minWidth}` : (d.minWidth==undefined ? `~${d.maxWidth}` : `${d.minWidth}-${d.maxWidth}`) + " mm"));
		}
		if(d.minHeight || d.maxHeight) {
			add(create("span", getLang("height"), "height"), create("span", d.maxHeight==undefined||d.maxHeight==d.minHeight ? `~${d.minHeight}` : (d.minHeight==undefined ? `~${d.maxHeight}` : `${d.minHeight}-${d.maxHeight}`) + " mm"));
		}
		if(d.lifespan) {
			var lifespan = create("span");
			lifespan.className = "lang";
			if(d.lifespan < 12) {
				lifespan.dataset.lang = "lifespan-" + (d.lifespan==1 ? "month" : "months");
				lifespan.dataset.args = d.lifespan;
			} else {
				lifespan.dataset.lang = "lifespan-" + (d.lifespan==12 ? "year" : "years");
				lifespan.dataset.args = d.lifespan / 12;
			}
			updateLang([lifespan]);
			add(create("span", getLang("lifespan"), "lifespan"), lifespan);
		}
		snail.appendChild(table);
		if(d.location) {
			const _002 = ['DZ', 'EG', 'EH', 'LY', 'MA', 'SD', 'SS', 'TN', 'BF', 'BJ', 'CI', 'CV', 'GH', 'GM', 'GN', 'GW', 'LR', 'ML', 'MR', 'NE', 'NG', 'SH', 'SL', 'SN', 'TG', 'AO', 'CD', 'ZR', 'CF', 'CG', 'CM', 'GA', 'GQ', 'ST', 'TD', 'BI', 'DJ', 'ER', 'ET', 'KE', 'KM', 'MG', 'MU', 'MW', 'MZ', 'RE', 'RW', 'SC', 'SO', 'TZ', 'UG', 'YT', 'ZM', 'ZW', 'BW', 'LS', 'NA', 'SZ', 'ZA'];
			const _005 = ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'];
			const _009 = ['AU', 'NF', 'NZ', 'FJ', 'NC', 'PG', 'SB', 'VU', 'FM', 'GU', 'KI', 'MH', 'MP', 'NR', 'PW', 'AS', 'CK', 'NU', 'PF', 'PN', 'TK', 'TO', 'TV', 'WF', 'WS'];
			const _013 = ['BZ', 'CR', 'GT', 'HN', 'MX', 'NI', 'PA', 'SV', 'AG', 'AI', 'AN', 'AW', 'BB', 'BL', 'BS', 'CU', 'DM', 'DO', 'GD', 'GP', 'HT', 'JM', 'KN', 'KY', 'LC', 'MF', 'MQ', 'MS', 'PR', 'TC', 'TT', 'VC', 'VG', 'VI'];
			const _021 = ['BM', 'CA', 'GL', 'PM', 'US'];
			const _142 = ['TM', 'TJ', 'KG', 'KZ', 'UZ', 'CN', 'HK', 'JP', 'KP', 'KR', 'MN', 'MO', 'TW', 'AF', 'BD', 'BT', 'IN', 'IR', 'LK', 'MV', 'NP', 'PK', 'BN', 'ID', 'KH', 'LA', 'MM', 'BU', 'MY', 'PH', 'SG', 'TH', 'TL', 'TP', 'VN', 'AE', 'AM', 'AZ', 'BH', 'CY', 'GE', 'IL', 'IQ', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'NT', 'SY', 'TR', 'YE', 'YD'];
			const _150 = ['GG', 'JE', 'AX', 'DK', 'EE', 'FI', 'FO', 'GB', 'IE', 'IM', 'IS', 'LT', 'LV', 'NO', 'SE', 'SJ', 'AT', 'BE', 'CH', 'DE', 'DD', 'FR', 'FX', 'LI', 'LU', 'MC', 'NL', 'BG', 'BY', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SU', 'SK', 'UA', 'AD', 'AL', 'BA', 'ES', 'GI', 'GR', 'HR', 'IT', 'ME', 'MK', 'MT', 'CS', 'RS', 'PT', 'SI', 'SM', 'VA', 'YU'];
			var regions = {'002': false, '005': false, '009': false, '013': false, '021': false, '142': false, '150': false};
			const locations = d.location.split(",");
			var iso = [["Country"]];
			for(var i in locations) {
				const s = locations[i].split(".");
				const code = s[0].toUpperCase();
				for(var key in regions) {
					if(eval("_" + key).indexOf(code) != -1) regions[key] = true;
				}
				iso.push([code]);
			}
			console.log(iso);
			console.log(regions);
			var map = create("div");
			div.appendChild(map);
			var chart = new google.visualization.GeoChart(map);
			var region = "world";
			var single = true;
			for(var key in regions) {
				if(regions[key]) {
					if(single) {
						region = key;
						single = false;
					} else {
						region = "world";
					}
				}
			}
			chart.draw(google.visualization.arrayToDataTable(iso), {region: region});
		}
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayTaxonomers() {
	var snail = clean();
	setTitle(getLang("list-taxonomers"), "list-taxonomers");
	for(var i in data.taxonomers.list) {
		const t = data.taxonomers.list[i];
		var div = create("div");
		div.appendChild(createLink(t.name.length ? `${t.surname}, ${t.name}` : t.surname, `taxonomer/${t.id}`));
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayTaxonomer(taxonomer) {
	var snail = clean();
	const info = data.taxonomers[taxonomer];
	console.log(info);
	setTitle(`${info.name} ${info.surname}`);
	function display(type) {
		if(info[type].length > 0) {
			snail.appendChild(create("b", getLang(type), type));
			for(var i in info[type]) {
				const s = info[type][i];
				var p = create("p");
			}
		}
	}
	display("superfamilies");
	display("families");
	display("genuses");
	display("species");
	showSection("snail");
}

function clean() {
	var snail = document.getElementById("snail");
	snail.innerText = "";
	return snail;
}

function addHeader(...args) {
	const d = ["superfamily", "family", "genus", "species"];
	var table = create("table");
	table.style.marginBottom = "16px";
	for(var i=0; i<args.length-1; i++) table.appendChild(addHeaderImpl(d[i], args[i], "/snail/" + args.slice(0, i+1).join("/")));
	table.appendChild(addHeaderImpl(d[args.length-1], args[args.length-1]));
	document.getElementById("snail").appendChild(table);
}

function addHeaderImpl(desc, value, uri) {
	var tr = create("tr");
	var td1 = create("td");
	var td2 = create("td");
	td1.style.textAlign = "right";
	if(!uri) td1.style.verticalAlign = "top";
	td1.appendChild(create("span", getLang(desc), desc));
	if(!uri) td2.appendChild(create("b", capitalize(value)));
	else td2.appendChild(createLink(capitalize(value), uri));
	tr.appendChild(td1);
	tr.appendChild(td2);
	return tr;
}

function taxonomers(data, parent) {
	if(data.taxonomyYear > 0) {
		parent.appendChild(create("span", "&nbsp;("));
		for(var i in data.taxonomers) {
			parent.appendChild(createLink(data.taxonomers[i].surname, `/taxonomer/${data.taxonomers[i].id}`));
			if(i == data.taxonomers.length - 2) parent.appendChild(create("span", " & "));
			else parent.appendChild(create("span", ", "));
		}
		parent.appendChild(create("span", data.taxonomyYear));
		parent.appendChild(create("span", ")"));
	}
	return parent;
}
