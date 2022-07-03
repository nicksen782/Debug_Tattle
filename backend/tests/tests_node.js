try {
	process.chdir(__dirname);
	//   console.log('New directory: ' + process.cwd());
}
catch (err) {
	console.log('Could not change working directory: ' + err);
	process.exit(1);
}

// const fetch   = import('node-fetch');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("config.json", 'utf8'));
const urlHttp       = "http://"  + config.hostname + config.path;
const urlHttps      = "https://" + config.hostname + config.path;
const active_apikey = config.apikey;

function NODE_POST_HTTP_T1(key, value, apikey, url){
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
			hostname:'192.168.2.55', 
			path:`${"/Debug_Tattle/backend/router_p.php"}`,
			// hostname:'', 
			// path:`${url}`,
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' }
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { d = JSON.parse(d); }
				catch(e){}
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.write(body);
		req.end();
	});
}

function NODE_POST_HTTPS_T1(key, value, apikey, url){
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
			hostname:config.hostname, 
			path:config.path,
			// "headers"  : { "Content-Type":'application/x-www-form-urlencoded' }
			"headers"  : { "Content-Type":'application/json' },
			"port": 443
		};
		const req = _http.request(options, (res) => {
			let d = '';
			res.on('data', (c)=>{d+=c;}); 
			res.on('end', ()=>{
				try     { d = JSON.parse(d); }
				catch(e){}
				resolve(d);
			});
		})
		.on("error", (err) => { reject(err); });
		req.write(body);
		req.end();
	});
}

// build-in http module.
(async function(){
	let tests = [
		// POST: Built-in http and https module.
		{ "f": NODE_POST_HTTP_T1 , "k":"NODE_POST_HTTP_T1" , "v":"POST: http-built-in Node v16" , "a":active_apikey, "u":urlHttp },
		{ "f": NODE_POST_HTTPS_T1, "k":"NODE_POST_HTTPS_T1", "v":"POST: https-built-in Node v16", "a":active_apikey, "u":urlHttps },
	];
	for(let i=0; i<tests.length; i+=1){
		try{ 
			let resp = await tests[i].f(tests[i].k, tests[i].v, tests[i].a, tests[i].u);
			console.log( `${tests[i].f.name.padEnd(20, " ").toUpperCase()}:`, resp ); 
		} 
		catch(e){ 
			console.log( `${tests[i].f.name.padEnd(20, " ").toUpperCase()}:`, "ERROR" ); 
		}
	}
})();