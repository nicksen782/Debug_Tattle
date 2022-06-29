// const fetch   = import('node-fetch');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("config.json", 'utf8'));
const url           = config.url;
const urlHttps      = config.url.replace("http://", "https://");
const active_apikey = config.apikey;

function node_http_post1(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		const _http = require('http');
		let _data = {
			"origin" : { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		let body = JSON.stringify( {o:'add', key:apikey, data:(_data)} );
		const options = { 
			method:'POST', 
			hostname:'', 
			path:`${url}`,
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' }
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { console.log("test_http_post: JSON body: ", JSON.parse(d)); }
				catch(e){ console.log('test_http_post: TEXT body:', d);              }
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.write(body);
		req.end();
	});
}

function node_http_get1(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		const _http = require('http');
		let _data = {
			"origin": { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		const options = {
			"method"   :'GET', 
			"hostname" :'', 
			"path"     : `${url}?o=add&key=${apikey}&data=` + encodeURIComponent (JSON.stringify(_data)),
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' }
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { console.log("test_http_get: JSON body: ", JSON.parse(d)); }
				catch(e){ console.log('test_http_get: TEXT body:', d);              }
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.end();
	});
}

function node_https_post1(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		// const _http = require('http');
		const _http = require('https');
		let _data = {
			"origin" : { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		let body = JSON.stringify( {o:'add', key:apikey, data:(_data)} );
		const options = { 
			method:'POST', 
			hostname:'', 
			path:`${urlHttps}`,
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' },
			"port": 443
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { console.log("test_http_post: JSON body: ", JSON.parse(d)); }
				catch(e){ console.log('test_http_post: TEXT body:', d);              }
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.write(body);
		req.end();
	});
}

function node_https_get1(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		// const _http = require('http');
		const _http = require('https');
		let _data = {
			"origin": { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		const options = {
			"method"   :'GET', 
			"hostname" :'', 
			"path"     : `${urlHttps}?o=add&key=${apikey}&data=` + encodeURIComponent (JSON.stringify(_data)),
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' },
			"port": 443
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { console.log("test_http_get: JSON body: ", JSON.parse(d)); }
				catch(e){ console.log('test_http_get: TEXT body:', d);              }
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.end();
	});
}

async function node_fetch_post(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		const _fetch = require('node-fetch');
		let _data = {
			"origin": { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		let fetch_url = `${url}?o=add&key=${apikey}`;
		let options = {
			"method": "POST", 
			// "headers": { 'Content-Type': 'application/x-www-form-urlencoded' },
			"headers": { 'Content-Type': 'application/json' },
			"body": JSON.stringify( {o:'add', key:apikey, data:JSON.stringify(_data) } )
		};
		try{ _fetch(fetch_url, options); resolve(); } catch(e){ reject(e); }
	});
}

async function node_fetch_get(key, value, apikey){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "fName":frame.split("at ")[1].split(" ")[0], "lNum":frame.split(":").reverse()[1] };
		if(o.fName.indexOf(".") != -1){ o.fName = o.fName.substring(o.fName.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		const _fetch = require('node-fetch');
		let _data = {
			"origin": { "FILE": __filename , "LINE": _stats.lNum , "FUNCTION" : _stats.fName },
			"data"   : { [key] : value }
		};
		let fetch_url = `${url}?o=add&key=${apikey}&data=${JSON.stringify(_data)}`;
		let options = {
			"method": "GET", 
			// "headers": { 'Content-Type': 'application/x-www-form-urlencoded' },
			"headers": { 'Content-Type': 'application/json' },
		}
		try{ _fetch(fetch_url, options); resolve(); } catch(e){ reject(e); }
	});
}

// build-in http module.
(async function(){
	let tests = [
		// Build-in http module. (testing.)
		{ "f": node_http_post1, "k":"node_http_post1", "v":"POST: http-built-in Node v16", "a":active_apikey, "u":url },
		// { "f": node_http_get1 , "k":"node_http_get1" , "v":"GET : http-built-in Node v16", "a":active_apikey, "u":url },
		
		// Build-in https module. (testing.)
		// { "f": node_https_post1, "k":"node_https_post1", "v":"POST: https-built-in Node v16", "a":active_apikey, "u":url },
		// { "f": node_https_get1 , "k":"node_https_get1" , "v":"GET : https-built-in Node v16", "a":active_apikey, "u":url },
		
		// Using node-fetch v2 package.
		{ "f": node_fetch_post , "k":"node_fetch_post" , "v":"POST: node-fetch Node v16", "a":active_apikey, "u":url },
		// { "f": node_fetch_get  , "k":"node_fetch_get"  , "v":"GET : node-fetch Node v16", "a":active_apikey, "u":url },
	];
	for(let i=0; i<tests.length; i+=1){
		try{ await tests[i].f(tests[i].k, tests[i].v, tests[i].a, tests[i].u); } catch(e){ console.log(`ERROR: ${tests[i].f.name}:`, e); }
	}
})();