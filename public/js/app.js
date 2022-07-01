let _APP = {};
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
		// Delete the apikey cookie.
		_APP.auth.cookies.deleteCookie("debug_tattleV6_apikey");

		// Redirect to the login page with a message.
		let url = window.location.origin + window.location.pathname.replace("app.php", "login.php") + `?msg=MSG_LOGIN_LOGOUT`
		window.location.href = url; 
		;
	},
};
_APP.logs = {
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
			button1.addEventListener("click", function(){ _APP.logs.removeOne(obj.rec.tid); }, false);
			
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
					{ "k":"date"    , "l":"DATE    :", },
					{ "k":"ip"      , "l":"ORIGIN  :", },
					{ "k":"function", "l":"FUNCTION:", },
					{ "k":"line"    , "l":"LINE    :", },
					{ "k":"method"  , "l":"METHOD  :", },
					{ "k":"user"    , "l":"USER    :", },
					{ "k":"apikey"  , "l":"APIKEY  :", },
				];
				data.forEach(function(data_rec){
					// Break out the values.
					let key   = data_rec.k;
					let label = data_rec.l;
					let value = rec[key] ;

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
	getAll: function(){
		return new Promise(async function(resolve,reject){
			let obj = {
				"o":"getAll",
				"key":_APP.auth.apikey,
			};
			let resp = await _APP.fetch.json_post("gateway_p.php", obj);
			resolve(resp);
		});
	},
	removeOne: function(tid){
		return new Promise(async function(resolve,reject){
			let obj = {
				"o":"removeOne",
				"key":_APP.auth.apikey,
				"tid": tid,
			};
			let resp = await _APP.fetch.json_post("gateway_p.php", obj);

			let data = await _APP.logs.getAll();
			_APP.logs.createTableRecs(data);

			resolve(resp);
		});
	},
	removeAll: function(){},
	sendToConsole: function(){},
};
window.onload = async function(){
	window.onload = null;

	// Read the apikey cookie and store to _APP.auth.apikey;
	_APP.auth.retrieveApikeyCookie("debug_tattleV6_apikey");

	let isApikeyValid = _APP.auth.checkNewApikey(_APP.auth.apikey);
	console.log("isApikeyValid:", isApikeyValid);
	// console.log("_APP.auth.apikey:", _APP.auth.apikey);

	// Clear the search.
	let loc = window.location.href;
	if(loc.indexOf("?")){
		loc = loc.split("?")[0];
		history.replaceState(null, document.title, loc);
	}

	let data = await _APP.logs.getAll();
	_APP.logs.createTableRecs(data);
};