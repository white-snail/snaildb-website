/*
 * Copyright (c) 2018 Kasokuz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
module app;

import std.file;
import std.string : endsWith;

import lighttp;

void main() {

	Server server = new Server();
	
	// index
	{
		debug server.router.add(Get(".*"), new SystemResource("text/html", "res/index.html"));
		else server.router.add(Get(".*"), new Resource("text/html", read("res/index.html")));
	}
	
	// other html
	foreach(string file ; dirEntries("res", SpanMode.shallow)) {
		if(file.endsWith(".html") && !file.endsWith("index.html")) {
			debug server.router.add(Get(file[4..$-5]), new SystemResource("text/html", file));
			else server.router.add(Get(file[4..$-5]), new Resource("text/html", read(file)));
		}
	}
	
	// css
	foreach(string file ; dirEntries("res/style", SpanMode.shallow)) {
		debug server.router.add(Get("style/" ~ file[10..$]), new SystemResource("text/css", file));
		else server.router.add(Get("style/" ~ file[10..$]), new CachedResource("text/css", read(file)));
	}
	
	// javascript
	foreach(string file ; dirEntries("res/script", SpanMode.shallow)) {
		debug server.router.add(Get("script/" ~ file[11..$]), new SystemResource("application/javascript", file));
		else server.router.add(Get("script/" ~ file[11..$]), new CachedResource("application/javascript", read(file)));
	}
	
	// png images
	foreach(string file ; dirEntries("res/img", SpanMode.shallow)) {
		debug server.router.add(Get("img/" ~ file[8..$]), new SystemResource("image/png", file));
		else server.router.add(Get("img/" ~ file[8..$]), new CachedResource("image/png", read(file)));
	}
	
	// svg images
	foreach(string file ; dirEntries("res/svg", SpanMode.shallow)) {
		debug server.router.add(Get("img/" ~ file[8..$]), new SystemResource("image/svg+xml", file));
		else server.router.add(Get("img/" ~ file[8..$]), new CachedResource("image/svg+xml", read(file)));
	}
	
	// language files
	foreach(string file ; dirEntries("res/lang", SpanMode.shallow)) {
		debug server.router.add(Get("lang/" ~ file[9..$]), new SystemResource("application/json", file));
		else server.router.add(Get("lang/" ~ file[9..$]), new CachedResource("application/json", read(file)));
	}
	
	server.host("0.0.0.0");
	server.run();

}

debug class SystemResource : Resource {

	private immutable string path;
	
	this(string mime, string path) {
		super(mime);
		this.path = path;
	}
	
	override void apply(Request req, Response res) {
		this.uncompressed = read(path);
		super.apply(req, res);
	}

}
