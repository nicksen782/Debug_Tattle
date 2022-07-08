_APP.fetch = {
	// Used for POST requests (configurable.)
	json_post           : async function(url, body){
		return new Promise(async function(res,rej){
			// Backend should send JSON. 
			let resp;
			// _APP.fetch.dom["progress"].classList.add("active");

			try{
				resp = await fetch(
					url, 
					{
						method: 'POST',
						headers: {
							'Accept'          : 'application/json',
							"Accept-Encoding" : 'gzip;q=0,deflate;q=0',
							'Content-Type'    : 'application/json', // Works.
							// 'Content-Type'    : 'application/x-www-form-urlencoded', // Does not work.
							// 'Content-Type'    : 'multipart/form-data', // works.
							// "Content-Encoding": 'gzip',
						},
						body: JSON.stringify(body)
					}
				)
				.catch(
					e=> { 
						throw `HTTP error. URL: ${url}`;
					} 
				);
			}
			catch(e){
				rej(e);
				return;
			}

			if(resp && resp.ok){
				resp = await resp.json();
			}
			else{
				rej("Could not convert to JSON");
				return; 
			}

			// _APP.fetch.dom["progress"].classList.remove("active");
			res(resp);
			// return resp;
		});
	},
};

_APP.auth = {
	apikey: "",
	// Used during apikey change for a user.
	checkNewApikey: function(newApiKey){
		// Get the length of the string. 
		let str_length = newApiKey.length;

		// Get counts of each type of character in the string. 
		let cnt_lowercase = (newApiKey.match(/[a-z]/g)          || []).length;
		let cnt_uppercase = (newApiKey.match(/[A-Z]/g)          || []).length;
		let cnt_nums      = (newApiKey.match(/[0-9]/g)          || []).length;
		let cnt_spaces    = (newApiKey.match(/[\s]/g)           || []).length;
		let cnt_special   = (newApiKey.match(/[^A-Za-z0-9\s]/g) || []).length;

		// Set flags that must all be true for the apikey to be valid.
		let flag_length    = str_length    >  10 ? true : false;
		let flag_lowercase = cnt_lowercase >  1 ? true : false;
		let flag_uppercase = cnt_uppercase >  1 ? true : false;
		let flag_nums      = cnt_nums      >  1 ? true : false;
		let flag_spaces    = cnt_spaces    >= 0 ? true : false;
		let flag_special   = cnt_special   >  1 ? true : false;

		// Compare flags to determine if the apikey is valid. 
		let valid = flag_length && flag_lowercase && flag_uppercase && flag_nums && flag_spaces && flag_special;

		// DEBUG
		// console.log("flag_length   :", flag_length   , ", str_length   :", str_length);
		// console.log("flag_lowercase:", flag_lowercase, ", cnt_lowercase:", cnt_lowercase);
		// console.log("flag_uppercase:", flag_uppercase, ", cnt_uppercase:", cnt_uppercase);
		// console.log("flag_nums     :", flag_nums     , ", cnt_nums     :", cnt_nums);
		// console.log("flag_spaces   :", flag_spaces   , ", cnt_spaces   :", cnt_spaces);
		// console.log("flag_special  :", flag_special  , ", cnt_special  :", cnt_special);
		// console.log("valid        :", valid);

		// Return the valid flag.
		return valid;
	},
	// NOT USED.
	retrieveApikeyCookie: function(){
		// Set the apikey.
		_APP.auth.apikey = _APP.auth.cookies.getCookieValue("debug_tattleV6_apikey");

		// Return the apikey.
		return _APP.auth.apikey;
	},
	cookies: {
		// Get the value of a cookie via it's name.
		getCookieValue : function(name) {
			return decodeURI(document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '') ;
		},
		// Remove a cookie via it's name.
		deleteCookie : function(name) {
			return document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
		},
	},
	logout: function(){
		if(!confirm("Are you sure that you want to log-out?")){
			return;
		}
		// Delete the apikey cookie.
		_APP.auth.cookies.deleteCookie("debug_tattleV6_apikey");

		// Redirect to the login page with a message.
		let url = window.location.origin + window.location.pathname.replace("app.php", "login.php") + `?msg=MSG_LOGIN_LOGOUT`
		window.location.href = url; 
	},

	init: function(){
		let header_user   = document.getElementById("header_user").querySelector("span:nth-child(2)");
		let header_logout = document.getElementById("header_logout");

		header_user.innerText = _APP.internal.username;
		header_logout.addEventListener("click", _APP.auth.logout, false);

		console.log("header_user:",header_user);
		console.log("header_logout:",header_logout);
	},
};
_APP.logs = {
	// Time ago utility.
	timeAgo: function(unixTime){
		var d = Math.floor(Math.abs(unixTime - new Date().getTime()) / 1000);  // delta
		var r = {};                                                // result
		var s = {                                                  // structure
			year  : 31536000, month : 2592000, week  : 604800,  
			day   : 86400   , hour  : 3600   , minute: 60, 
			second: 1,
		};
		Object.keys(s).forEach(function(key){
			r[key] = Math.floor(d / s[key]);
			d -= r[key] * s[key];
			if(["hour","minute","second"].indexOf(key) !=-1){
				r[key] = r[key].toString().padStart(2, "0");
			}
		});
		
		let ago = "";
		if(r.year          ) { ago += `${r.year  }y `;} 
		if(r.week          ) { ago += `${r.week  }w `;} 
		if(r.month         ) { ago += `${r.month }M `;} 
		if(r.day    != "00") { ago += `${r.day   }d `;} 
		if(r.hour   != "00") { ago += `${r.hour  }h `;} 
		ago += `${r.minute ? r.minute : "00"}m `; 
		ago += `${r.second ? r.second : "00"}s `; 
		ago = ago.trim() + " ago";
		
		return {
			r: r,
			ago: ago
		};
	},

	// Table creation.
	createTableRec: function(rec, frag){
		let createTableContainer = function(rec){
			let table   = document.createElement("table");
			let caption = document.createElement("caption");
			let thead   = document.createElement('thead');
			let tbody   = document.createElement('tbody');
			table.append(caption, thead, tbody);
			
			table.classList.add("record_table", "separated1");
			caption.innerText = `TID: ${rec.tid}`;

			// Create the buttons div.
			let buttonsDiv = document.createElement("div");
			buttonsDiv.classList.add("buttonsDiv");

			let button = document.createElement('div');
			button.innerText = "Record to DEV console.";
			button.classList.add("actionButton1");
			button.addEventListener("click", function(){ console.log(rec); }, false);

			buttonsDiv.append(button);
			caption.append(buttonsDiv);

			return {
				table  : table,
				caption: caption,
				thead  : thead,
				tbody  : tbody,
				rec    : rec,
			};
		};
		let createTableHead = function(obj){
			// Create the row and add class.
			let tr = obj.thead.insertRow(-1);
			tr.classList.add("borderBottom");

			// Create the th elements.
			tr.insertCell(-1).outerHTML = "<th class='leftColumn borderRight'>METADATA</th>";
			tr.insertCell(-1).outerHTML = "<th class='rightColumn logTh'>LOG</th>";

			// Find the second th.
			let th2 = tr.querySelector(".logTh");

			// Create the buttons div.
			let buttonsDiv = document.createElement("div");
			buttonsDiv.classList.add("buttonsDiv");
			
			// Create remove button.
			let button1 = document.createElement("div");
			button1.innerText = "Remove";
			button1.classList.add("actionButton1");
			// If admin then change "ownApikey" to "otherUserApikey"
			button1.addEventListener("click", function(){ _APP.logs.user.removeOne(obj.rec.tid, obj.table, "own", obj.rec.user); }, false);
			
			// Create log button.
			let button2 = document.createElement("div");
			button2.innerText = "Log to console";
			button2.classList.add("actionButton1");
			button2.addEventListener("click", function(){ console.log(rec.data); }, false);
			
			// Add the buttons.
			buttonsDiv.append(button1);
			buttonsDiv.append(button2);
			th2.append(buttonsDiv);
		};
		let createTableBody = function(obj){
			let createMetadataTd = function(obj){
				let table   = document.createElement("table");
				let caption = document.createElement("caption");
				let thead   = document.createElement('thead');
				let tbody   = document.createElement('tbody');
				table.append(caption, thead, tbody);

				let table_meta = document.createElement("table");
				table_meta.classList.add("metadata");
				
				let data = [
					{ "k":"ago"     , "l":"Ago     :" },
					{ "k":"date"    , "l":"DATE    :" },
					{ "k":"ip"      , "l":"ORIGIN  :" },
					{ "k":"function", "l":"FUNCTION:" },
					{ "k":"line"    , "l":"LINE    :" },
					{ "k":"method"  , "l":"METHOD  :" },
					{ "k":"user"    , "l":"USER    :" },
				];
				data.forEach(function(data_rec){
					// Break out the values.
					let label ;
					let value ;

					if(data_rec.k == "ago"){
						// Break out the values.
						label = data_rec.l;
						value = _APP.logs.timeAgo( new Date(rec.date).getTime() ).ago ;
					}
					else{
						// Break out the values.
						label = data_rec.l;
						value = rec[ data_rec.k ] ;
					}

					// Create the row.
					let tr_row = table_meta.insertRow(-1);

					// Create the th.
					tr_row.insertCell(-1).outerHTML = `<th>${label}</th>`;

					// Create the td.
					let row_td2 = tr_row.insertCell(-1); row_td2.innerText = value;
				});
				
				return table_meta;
			};
			let createLogTd = function(obj){
				// DOM
				let log_filename     = document.createElement("div");
				let log_data         = document.createElement("div");
				let logs             = document.createElement("div");
				let logs_content     = document.createElement("div");
				let errors           = document.createElement("div");
				let errors_title     = document.createElement("div");
				let errors_content   = document.createElement("div");

				// Classes/attributes
				log_filename    .classList.add("log_filename");
				log_data        .classList.add("log_data");
				logs            .classList.add("logs");
				logs_content    .classList.add("content");
				errors          .classList.add("errors");
				errors_title    .classList.add("title");
				errors_content  .classList.add("content");

				// DATA
				log_filename    .innerText = `${obj.rec.file}`;
				logs_content    .innerText = JSON.stringify(obj.rec.data,null,2);
				errors_title    .innerText = "ERRORS";
				errors_content  .innerText = JSON.stringify(obj.rec.errors,null,0);

				// Appends
				log_data.append(logs);
				logs.append(log_filename, logs_content);
				try{
					if(obj.rec.errors){
						log_data.append(errors);
						errors.append(errors_title, errors_content);
					}
				}
				catch(e){ console.log("Error parsing errors.", e); }

				return log_data;
			};

			// Need 1 tr with 2 td.
			let tr = obj.tbody.insertRow(-1);
			let td1 = tr.insertCell(-1); td1.append( createMetadataTd(obj) );
			td1.classList.add("borderRight");
			let td2 = tr.insertCell(-1); td2.append( createLogTd     (obj) );
		};

		// Convert the JSON text to JSON.
		rec.data   = JSON.parse(rec.data);
		rec.errors = JSON.parse(rec.errors);

		// Create the table.
		let obj = createTableContainer(rec);
		createTableHead(obj);
		createTableBody(obj);

		// Return the completed table.
		return obj.table;
	},
	createTableRecs: function(recs){
		// Get a handle to the dest div.
		let destDiv = document.getElementById("records_div");
		
		// Create each record into a fragment.
		let frag = document.createDocumentFragment();
		recs.forEach(function(rec){
			frag.append( _APP.logs.createTableRec(rec) );
		});

		// Clear the dest.
		destDiv.innerHTML = "";

		// Add the fragment.
		destDiv.appendChild(frag);
	},

	// API calls.
	admin: {
		getAll: function(){
			return new Promise(async function(resolve,reject){
				let obj = {
					"o":"getAll",
					"key":_APP.auth.apikey,
				};
				let resp = await _APP.fetch.json_post("gateway_p.php", obj);
				_APP.logs.createTableRecs(resp);
	
				resolve(resp);
			});
		},
		removeAll: function(){
			return new Promise(async function(resolve,reject){
				let obj = {
					"o":"removeAll",
					"key":_APP.auth.apikey,
				};
				let resp = await _APP.fetch.json_post("gateway_p.php", obj);
				await _APP.logs.admin.getAll();
				resolve();
			});
		},

		// TESTS
		internalLogTest: function(){
			return new Promise(async function(resolve,reject){
				let obj = {
					"o":"internalLogTest",
					"key":_APP.auth.apikey,
				};
				let resp = await _APP.fetch.json_post("gateway_p.php", obj);
				await _APP.logs.admin.getAll();
				resolve();
			});
		},
		webLogTest: function(){
			let _stats = (function (){ 
				let e = new Error(); let lines = e.stack.split("\n").map(d=>d.trim());
				let file = lines[1].replace("at ", "").split(":").filter(d=>isNaN(d)).join("").replace("//", "://"); 
				let func = lines[2].split("at ")[1].split(" ")[0]; func = func.indexOf(".") ? func.substring(func.indexOf(".")+1) : func;
				let line = lines[2].split(":").reverse()[1];
				return { "file":file, "func":func, "line":line };
			})();
			return new Promise(async function(resolve,reject){
				let obj = {
					"o":"add", "key":_APP.auth.apikey,
					"data" : {
						"origin" : { "FILE": _stats.file , "LINE": _stats.line , "FUNCTION" : _stats.func },
						"data"   : { 
							"webLogTest" : "webLogTest"
						}
					}
				};
				let resp = await _APP.fetch.json_post("gateway_p.php", obj);
				await _APP.logs.admin.getAll();
				resolve();
			});
		},
	},
	user: {
		removeOne: function(tid, table, filterName="own", filterValue=""){
			return new Promise(async function(resolve,reject){
				let filterNames = [
					"own",
					"other",
				];
				if(filterNames.indexOf(filterName) == -1){ reject("ERROR: Invalid filterName."); return; }
				switch(filterName){
					case "own"  : { break; }
					case "other": { break; }
				};
	
				let obj = {
					"o":"removeOne",
					"key":_APP.auth.apikey,
					"tid": tid,
					"filterName" : filterName,
					"filterValue": filterValue,
				};
				let resp = await _APP.fetch.json_post("gateway_p.php", obj);
	
				if(table){
					// Only remove the entry, don't refresh the list.
					table.remove();
				}
				else{
					// Refresh the list.
					await _APP.logs.getSome();
				}
	
				resolve(resp);
			});
		},
	},

	getSome: function(filterName="ownApikey", filterValue=""){
		return new Promise(async function(resolve,reject){
			let filterNames = [
				"ownApikey",
				"otherUserApikey",
				"unknownUser",
			];
			if(filterNames.indexOf(filterName) == -1){ reject("ERROR: Invalid filterName."); return; }
			switch(filterName){
				case "ownApikey"      : { break; }
				case "otherUserApikey": { break; }
				case "unknownUser"    : { break; }
			};

			let obj = {
				"o"          : "getSome",
				"key"        : _APP.auth.apikey,
				"filterName" : filterName,
				"filterValue": filterValue,
			};
			let resp = await _APP.fetch.json_post("gateway_p.php", obj);
			if(resp.error){
				console.log("resp.errors:", resp.errors);
				reject(resp.errors);
			}
			else{
				_APP.logs.createTableRecs(resp.results);
			}

			resolve(resp);
		});
	},
	
	sendToConsole: function(){},

	init: function(){
		let records_getSome    = document.getElementById("records_getSome");
		records_getSome   .addEventListener("click", function(){_APP.logs.getSome();}, false);

		let records_getAll    = document.getElementById("records_getAll");
		records_getAll   .addEventListener("click", _APP.logs.admin.getAll, false);

		let records_removeAll = document.getElementById("records_removeAll");
		records_removeAll.addEventListener("click", _APP.logs.admin.removeAll, false);

		let records_test1 = document.getElementById("records_test1");
		records_test1.addEventListener("click", _APP.logs.admin.internalLogTest, false);

		let records_test2 = document.getElementById("records_test2");
		records_test2.addEventListener("click", _APP.logs.admin.webLogTest, false);
	},
};
_APP.examples = {
	examplesDOM : [],
	selectText : function(elem){
		window.getSelection().selectAllChildren(elem);
	},

	// String replacements for the examples to the user's values.
	fixPhpExamples     : function(){
		// Get handle to the example content div.
		let exampleDiv = document.querySelector("#example_php .example_content");
		exampleDiv.addEventListener("dblclick", function(){ _APP.examples.selectText(exampleDiv); }, false);

		// For PHP we do a global string replace.
		let lines = exampleDiv.innerText.split("\n").filter(d=> d.trim() != "").join("\n");;

		// Create replacements for "URL" and "APIKEY"
		let urlSpan    = document.createElement("span"); 
		urlSpan.classList.add("example_url");
		urlSpan.innerText = window.location.origin + window.location.pathname.replace("app.php", "gateway_p.php");

		let apikeySpan = document.createElement("span"); 
		apikeySpan.classList.add("example_key");
		apikeySpan.innerText = _APP.auth.apikey;

		// Replace the placeholders with the current values.
		lines = lines
		.replace("__URL__", urlSpan.outerHTML)
		.replace("__APIKEY__", apikeySpan.outerHTML)
		;

		// Replace the div content.
		exampleDiv.innerHTML = lines;
	},
	fixNodeExamples    : function(){
		// Get handle to the example content div.
		let exampleDiv = document.querySelector("#example_node .example_content");
		exampleDiv.addEventListener("dblclick", function(){ _APP.examples.selectText(exampleDiv); }, false);

		// For NODE we do a global string replace.
		let lines = exampleDiv.innerText.split("\n").filter(d=> d.trim() != "").join("\n");

		// Create replacements for "URL" and "APIKEY"
		let protocolSpan    = document.createElement("span"); 
		protocolSpan.classList.add("example_protocol");
		protocolSpan.innerText = window.location.protocol.replace(/[^A-Za-z]/g, "") == "https" ? true : false;

		let hostnameSpan    = document.createElement("span"); 
		hostnameSpan.classList.add("example_url");
		hostnameSpan.innerText = window.location.host;

		let pathSpan    = document.createElement("span"); 
		pathSpan.classList.add("example_url");
		pathSpan.innerText = window.location.pathname.replace("app.php", "gateway_p.php");

		let apikeySpan = document.createElement("span"); 
		apikeySpan.classList.add("example_key");
		apikeySpan.innerText = _APP.auth.apikey;

		// Replace the placeholders with the current values.
		lines = lines
		.replace("__HTTP__"    , protocolSpan.outerHTML)
		.replace("__HOSTNAME__", hostnameSpan.outerHTML)
		.replace("__PATH__"    , pathSpan.outerHTML)
		.replace("__APIKEY__"  , apikeySpan.outerHTML)
		;

		// Replace the div content.
		exampleDiv.innerHTML = lines;

	},
	fixBashCurlExamples: function(){
		// Get handle to the example content div.
		let exampleDiv = document.querySelector("#example_bash_curl .example_content");
		exampleDiv.addEventListener("dblclick", function(){ _APP.examples.selectText(exampleDiv); }, false);

		// For BASH_CURL we do a global string replace.
		let lines = exampleDiv.innerText.split("\n").filter(d=> d.trim() != "").join("\n");

		// Create replacements for "URL" and "APIKEY"
		let urlSpan    = document.createElement("span"); 
		urlSpan.classList.add("example_url");
		urlSpan.innerText = window.location.origin + window.location.pathname.replace("app.php", "gateway_p.php");

		let apikeySpan = document.createElement("span"); 
		apikeySpan.classList.add("example_key");
		apikeySpan.innerText = _APP.auth.apikey;

		// Replace the placeholders with the current values.
		lines = lines
		.replace("__URL__", urlSpan.outerHTML)
		.replace("__APIKEY__", apikeySpan.outerHTML)
		;

		// Replace the div content.
		exampleDiv.innerHTML = lines;
	},
	fixJsFetchExamples: function(){
		// Get handle to the example content div.
		let exampleDiv = document.querySelector("#example_js_fetch .example_content");
		exampleDiv.addEventListener("dblclick", function(){ _APP.examples.selectText(exampleDiv); }, false);
		exampleDiv.addEventListener("dblclick", function(){ _APP.examples.selectText(exampleDiv); }, false);

		// For JS FETCH we do a global string replace.
		let lines = exampleDiv.innerText.split("\n").filter(d=> d.trim() != "").join("\n");

		// Create replacements for "URL" and "APIKEY"
		let urlSpan    = document.createElement("span"); 
		urlSpan.classList.add("example_url");
		urlSpan.innerText = window.location.origin + window.location.pathname.replace("app.php", "gateway_p.php");

		let apikeySpan = document.createElement("span"); 
		apikeySpan.classList.add("example_key");
		apikeySpan.innerText = _APP.auth.apikey;

		// Replace the placeholders with the current values.
		lines = lines
		.replace("__URL__"   , urlSpan.outerHTML)
		.replace("__APIKEY__", apikeySpan.outerHTML)
		;

		// Replace the div content.
		exampleDiv.innerHTML = lines;
	},
	fixExamples: function(){
		_APP.examples.fixPhpExamples();
		_APP.examples.fixNodeExamples();
		_APP.examples.fixBashCurlExamples();
		_APP.examples.fixJsFetchExamples();
	},
	
	// Tab navigation.
	showOne: function(obj){
		obj.tab.classList.add("active");
		obj.contentDiv.classList.add("expanded");
		obj.expandIndicator.classList.add("up");
	},
	hideOne: function(obj){
		obj.tab.classList.remove("active");
		obj.contentDiv.classList.remove("expanded");
		obj.expandIndicator.classList.remove("up");
	},
	collapseOthers: function(ignoreThis){
		_APP.examples.examplesDOM.forEach(function(d){
			if(d != ignoreThis){ _APP.examples.hideOne(d); }
		});
	},
	collapseAll: function(){
		_APP.examples.examplesDOM.forEach(function(d){ _APP.examples.hideOne(d); });
	},

	init: function(){
		// DOM
		let tabs = document.querySelectorAll("#example_tabs .example_tab");
		tabs.forEach(function(tab){
			let viewid = tab.getAttribute("viewid");
			let div = document.getElementById(viewid);
			_APP.examples.examplesDOM.push({
				'tab'             : tab,
				'div'             : div,
				'expandIndicator' : tab.querySelector(".expandIndicator"),
				'contentDiv'      : div.querySelector(".example_content"),
			});
		});

		// Event listeners.
		_APP.examples.examplesDOM.forEach(function(d){
			d.tab.addEventListener("click", function(){ 
				// Hide the others.
				_APP.examples.collapseOthers(d);

				// Show or hide this one based on if it has "expanded" or not.
				if( !d.contentDiv.classList.contains("expanded") ){ _APP.examples.showOne(d); }
				else{ _APP.examples.hideOne(d); }
			}, false);
		});

		_APP.examples.fixExamples();
		// _APP.examples.collapseAll();
	},

};
_APP.nav = {
	navDOM : [],

	// Tab/View navigation.
	hideTabs : function(){
		_APP.nav.navDOM.forEach(function(d){ d.tab.classList.remove("active"); });
	},
	hideViews: function(){
		_APP.nav.navDOM.forEach(function(d){ d.view.classList.remove("show"); });
	},
	showTab  : function(elem){
		elem.tab.classList.add("active");
	},
	showView : function(elem){
		elem.view.classList.add("show");
	},

	init : function(){
		// 
		let tabs = document.querySelectorAll("#nav_tabs .nav_tab");
		tabs.forEach(function(tab){
			_APP.nav.navDOM.push({
				'tab'             : tab,
				'view'            : document.getElementById( tab.getAttribute("viewid") ),
			});
		});

		// Event listeners.
		_APP.nav.navDOM.forEach(function(d){
			d.tab.addEventListener("click", function(){ 
				_APP.nav.hideTabs();
				_APP.nav.hideViews();
				_APP.nav.showTab(d);
				_APP.nav.showView(d);
			}, false);
		});
	},
};
window.onload = async function(){
	window.onload = null;

	// Read the apikey from internal and store to _APP.auth.apikey;
	_APP.auth.apikey = _APP.internal.apikey;

	// Clear the search.
	let loc = window.location.href;
	if(loc.indexOf("?")){
		loc = loc.split("?")[0];
		history.replaceState(null, document.title, loc);
	}

	// Inits.
	_APP.auth.init();
	_APP.logs.init();
	_APP.examples.init();
	_APP.nav.init();
	await _APP.logs.getSome();
};
