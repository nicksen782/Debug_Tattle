
try { process.chdir(__dirname); }
catch (err) { console.log('Could not change working directory: ' + err); process.exit(1); }
if(process.argv[2] == ""){ console.log("ERROR: You did not specify the config file."); process.exit(); }
if(process.argv[3] == ""){ console.log("ERROR: You did not specify protocol (http or https.)"); process.exit(); }

const fs = require('fs');
const config        = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const urlHttp       = "http://"  + config.hostname + config.path;
const urlHttps      = "https://" + config.hostname + config.path;

function NODE_POST_T1(https, apikey, key, value){
	let _stats = (function(){ 
		let e = new Error(); let frame = e.stack.split("\n")[2].trim(); 
		let o = { "func":frame.split("at ")[1].split(" ")[0], "line":frame.split(":").reverse()[1] };
		if(o.func.indexOf(".") != -1){ o.func = o.func.substring(o.func.indexOf(".")+1); }
		return o; 
	})();
	return new Promise(async function(resolve, reject){
		let _http, _port;
		if(https){ _http = require('https'); _port = 443; }
		else     { _http = require('http');  _port = 80;  }
		let _data = {
			"origin" : { "FILE": __filename , "LINE": _stats.line , "FUNCTION" : _stats.func },
			"data"   : { [key] : value }
		};
		const options = { 
			method  : 'POST', 
			hostname: config.hostname, 
			path    : config.path,
			port    : _port,
			//headers  : { "Content-Type":'application/x-www-form-urlencoded' },
			headers  : { "Content-Type":'application/json' },
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
		req.write( JSON.stringify( {o:'add', key:apikey, data:(_data)} ) );
		req.end();
	});
}

// build-in http module.
(async function(){
	// Tests: POST: Built-in http module.
	let tests_http = [
		{ "f": NODE_POST_T1, "k":"NODE_POST_HTTP_T1" , "v":"POST: http built-in Node v16" , "a":config.apikey, "u":urlHttp },
	];
	// Tests: POST: Built-in https module.
	let tests_https = [
		{ "f": NODE_POST_T1, "k":"NODE_POST_HTTPS_T1", "v":"POST: https built-in Node v16", "a":config.apikey, "u":urlHttps },
	];
	
	// Determine which tests to run.
	let tests;
	if(process.argv[3] == "https"){ tests = tests_https; }
	else { tests = tests_http; }

	// Run the tests.
	for(let i=0; i<tests.length; i+=1){
		try{ 
			let https = tests[i].u.indexOf("https") == 0 ? true : false;
			let resp = await tests[i].f( https, tests[i].a, tests[i].k, tests[i].v );
			console.log( `${tests[i].k.padEnd(20, " ").toUpperCase()}:`, resp ); 
		} 
		catch(e){ 
			console.log( `${tests[i].k.padEnd(20, " ").toUpperCase()}:`, "ERROR" ); 
		}
	}
})();