function displaySuperfamilies() {
	var snail = clean();
	setTitle(getLang("superfamilies"), "superfamilies");
	for(var superfamily in data.snails.superfamily) {
		var d = data.snails.superfamily[superfamily];
		var div = create("div");
		div.appendChild(createLink(capitalize(d.name), `/snail/${d.name}`));
		div.appendChild(taxonomers(d));
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
		div.appendChild(taxonomers(d));
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
		div.appendChild(taxonomers(d));
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
		div.appendChild(taxonomers(d));
		snail.appendChild(div);
	}
	showSection("snail");
}

function displaySpecies(superfamily, family, genus, species) {
	setTitle(`${capitalize(genus)} ${capitalize(species)}`);
	var snail = clean();
	addHeader(superfamily, family, genus, species);
	for(var subspecies in data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies) {
		var d = data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies[subspecies];
		var div = create("div");
		div.appendChild(create("span", getLang("subspecies"), undefined, "subspecies"));
		div.appendChild(create("span", "&nbsp;"));
		div.appendChild(create("span", capitalize(d.name)));
		div.appendChild(taxonomers(d));
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayTaxonomer(taxonomer) {
	var snail = clean();
	
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

function taxonomers(data) {
	var parent = create("div");
	parent.style.display = "inline-block";
	if(data.taxonomyYear > 0) {
		parent.appendChild(create("span", "&nbsp;("));
		for(var i in data.taxonomers) {
			parent.appendChild(createLink(data.taxonomers[i].surname, `/taxonomer/${data.taxonomers[i].surname.toLowerCase()}`));
			if(i == data.taxonomers.length - 2) parent.appendChild(create("span", " & "));
			else parent.appendChild(create("span", ", "));
		}
		parent.appendChild(create("span", data.taxonomyYear));
		parent.appendChild(create("span", ")"));
	}
	return parent;
}