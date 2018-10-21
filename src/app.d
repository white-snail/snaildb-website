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

import lighttp;

void main() {

	Server server = new Server();
	server.router.add(new Router());
	server.host("0.0.0.0");
	server.run();

}

class Router {

	@Get(".*") Resource index;
	
	@Get("script", "core.js") Resource core;
	@Get("script", "lang.js") Resource lang;
	@Get("script", "snail.js") Resource snail;
	@Get("script", "util.js") Resource util;
	
	@Get("lang", "en.json") Resource en;
	@Get("lang", "es.json") Resource es;
	@Get("lang", "it.json") Resource it;
	
	this() {
		debug index = new SystemResource("text/html", "res/index.html");
		else index = new Resource("text/html", read("res/index.html"));
		static foreach(script ; ["core", "lang", "snail", "util"]) {
			debug mixin(script) = new SystemResource("application/javascript", "res/script/" ~ script ~ ".js");
			else mixin(script) = new CachedResource("application/javascript", read("res/script/" ~ script ~ ".js"));
		}
		static foreach(lang ; ["en", "es", "it"]) {
			debug mixin(lang) = new SystemResource("application/json", "res/lang/" ~ lang ~ ".json");
			else mixin(lang) = new CachedResource("application/json", read("res/lang/" ~ lang ~ ".json"));
		}
	}

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
