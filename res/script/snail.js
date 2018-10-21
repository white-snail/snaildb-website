function displaySuperfamilies() {
	var snail = clean();
	snail.appendChild(create("h2", getLang("superfamilies"), undefined, "superfamilies"));
	for(var superfamily in data.snails.superfamily) {
		var d = data.snails.superfamily[superfamily];
		var div = create("div");
		div.appendChild(create("a", capitalize(d.name), `/snail/${d.name}`));
		var span = create("span");
		span.appendChild(create("span", " ("));
		span.appendChild(create("a", d.taxonomer.surname, `/taxonomer/${d.taxonomer.surname.toLowerCase()}`));
		span.appendChild(create("span", `, ${d.taxonomyYear})`));
		div.appendChild(span);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displaySuperfamily(superfamily) {
	var snail = clean();
	addHeader(superfamily);
	for(var family in data.snails.superfamily[superfamily].families) {
		var d = data.snails.superfamily[superfamily].families[family];
		var div = create("div");
		div.appendChild(create("a", capitalize(d.name), `/snail/${superfamily}/${d.name}`));
		var span = create("span");
		span.appendChild(create("span", " ("));
		span.appendChild(create("a", d.taxonomer.surname, `/taxonomer/${d.taxonomer.surname.toLowerCase()}`));
		span.appendChild(create("span", `, ${d.taxonomyYear})`));
		div.appendChild(span);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayFamily(superfamily, family) {
	var snail = clean();
	addHeader(superfamily, family);
	for(var genus in data.snails.superfamily[superfamily].family[family].genuses) {
		var d = data.snails.superfamily[superfamily].family[family].genuses[genus];
		var div = create("div");
		div.appendChild(create("a", capitalize(d.name), `/snail/${superfamily}/${family}/${d.name}`));
		var span = create("span");
		span.appendChild(create("span", " ("));
		span.appendChild(create("a", d.taxonomer.surname, `/taxonomer/${d.taxonomer.surname.toLowerCase()}`));
		span.appendChild(create("span", `, ${d.taxonomyYear})`));
		div.appendChild(span);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displayGenus(superfamily, family, genus) {
	var snail = clean();
	addHeader(superfamily, family, genus);
	for(var species in data.snails.superfamily[superfamily].family[family].genus[genus].species) {
		var d = data.snails.superfamily[superfamily].family[family].genus[genus].species[species];
		var div = create("div");
		div.appendChild(create("a", capitalize(d.name), `/snail/${superfamily}/${family}/${genus}/${d.name}`));
		var span = create("span");
		span.appendChild(create("span", " ("));
		span.appendChild(create("a", d.taxonomer.surname, `/taxonomer/${d.taxonomer.surname.toLowerCase()}`));
		span.appendChild(create("span", `, ${d.taxonomyYear})`));
		div.appendChild(span);
		snail.appendChild(div);
	}
	showSection("snail");
}

function displaySpecies(superfamily, family, genus, species) {
	var snail = clean();
	addHeader(superfamily, family, genus, species);
	for(var subspecies in data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies) {
		var d = data.snails.superfamily[superfamily].family[family].genus[genus].species[species].subspecies[subspecies];
		var div = create("div");
		div.appendChild(create("i", getLang("subspecies"), undefined, "subspecies"));
		div.appendChild(create("span", "&nbsp;"));
		div.appendChild(create("span", capitalize(d.name)));
		var span = create("span");
		span.appendChild(create("span", " ("));
		span.appendChild(create("a", d.taxonomer.surname, `/taxonomer/${d.taxonomer.surname.toLowerCase()}`));
		span.appendChild(create("span", `, ${d.taxonomyYear})`));
		div.appendChild(span);
		snail.appendChild(div);
	}
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
	for(var i=0; i<args.length-1; i++) table.appendChild(addHeaderImpl(d[i], args[i], "/snail/" + args.slice(0, i).join("/")));
	table.appendChild(addHeaderImpl(d[args.length-1], args[args.length-1]));
	document.getElementById("snail").appendChild(table);
}

function addHeaderImpl(desc, value, uri) {
	console.log(uri);
	var tr = create("tr");
	var td1 = create("td");
	var td2 = create("td");
	td1.style.textAlign = "right";
	if(!uri) td1.style.verticalAlign = "top";
	td1.appendChild(create("i", getLang(desc), undefined, desc));
	if(!uri) td2.appendChild(create("h2", capitalize(value)));
	else td2.appendChild(create("span", capitalize(value), uri));
	tr.appendChild(td1);
	tr.appendChild(td2);
	return tr;
}
