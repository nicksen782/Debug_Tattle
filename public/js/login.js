const getCookieValue = (name) => (
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);
const deleteCookie = (name) => {
	document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};
let login = {
	// Used for GET requests expecting JSON.. 
	json_get            : async function(url){
		return new Promise(async function(res,rej){
			// Backend should send JSON. 
			let resp;

			try{
				resp = await fetch(
					url,
					{
						method: 'GET',
						headers: {
							"Accept"          : 'application/json',
							"Accept-Encoding" : 'gzip;q=0,deflate;q=0',
							'Content-Type'    : 'application/json'
							// "Content-Encoding": 'gzip',
						},
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
				console.log("catch3", resp);
				rej("Could not convert to JSON");
				return; 
			}

			res(resp);
			// return resp;
		});
	},

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

	// Get url params
	getUrlParams                     : function(){
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params          = Object.fromEntries(urlSearchParams.entries());
		return params;
	},

	// These come from the server.
	responseLookups : {
		// Example:
		"ERROR_LOGIN_BAD_KEY"  : "Invalid API key!"           , // Used by the server.
		"ERROR_LOGIN_DISABLED" : "This user is DISABLED."     , // Used by the server.
		"ERROR_LOGIN_NO_AUTH"  : "Authentication is required.",
		"MSG_LOGIN_LOGOUT"    : "You are now logged out."    ,
		// "ERROR_UNKNOWN_API"    : "ERROR_UNKNOWN_API"          ,
		// "ERROR_UNAUTHORIZED"   : "ERROR_UNAUTHORIZED"         ,
		// "ERROR_INVALID_METHOD" : "ERROR_INVALID_METHOD"       ,
	},

	// Get the login status and the responseLookups from the server.
	init: async function(){
		return new Promise(async function(resolve,reject){
			// Get the login status by checking the cookie.
			let getLoginStatus = async function(){
				let cookie = getCookieValue("debug_tattleV6_apikey");
				
				// console.log("cookie:", cookie);
				if(cookie){ 
					// console.log("has cookie");
					document.getElementById("key").value = cookie;

					// If logged in then display some login data.
					let loginStatusDiv = document.getElementById("loginStatus");
					loginStatusDiv.classList.remove("hide");
					// loginStatusDiv.querySelector("textarea").value = JSON.stringify(resp.session,null,1);
					// loginStatusDiv.querySelector("textarea").value = JSON.stringify(resp.session,null,1);

					// resolve(true);
					return true; 
				} 
				else { 
					// console.log("no cookie");
					document.getElementById("key").value = cookie;
					// resolve(false);
					return false 
				};
			};

			// Add event listener to the form submission.
			let addFormEvListeners = async function(){
				let loginForm = document.getElementById("loginForm");
				loginForm.addEventListener("submit", async function(e){ return false; }, false);

				let submitButton = document.getElementById("submit");
				submitButton.addEventListener("click", async function(e){
					let loginForm = document.getElementById("loginForm");
					let formData = new FormData(loginForm);
					let obj = {};
					for (const [key, value] of formData) { obj[key] = value; }
					let resp = await login.json_post(`login_p.php`, obj);
					if(resp.error || !resp.canLogin){ 
						let text = "";
						if(resp.error_key){ 
							text = resp.error_key + " : " + login.responseLookups[resp.error_key];
							if(resp.errors){
								text += "\n    " + resp.errors.join("\n    "); 
							}
						}
						else{ text = "ERROR_UNHANDLED" ; }
						alert( text );
					}
					else{
						window.location.href = "app.php";
					}
				});

				let logoutButton = document.getElementById("logout");
				logoutButton.addEventListener("click", async function(e){
					deleteCookie("debug_tattleV6_apikey");
					window.location.href = window.location.origin + window.location.pathname + `?msg=MSG_LOGIN_LOGOUT`;
					// window.location.reload();
				});
				
			};
			
			// If a message was specified then display it and clear the search.
			let getMsgs = async function(){
				let params = login.getUrlParams();
				if(Object.keys(params).length){
					console.log("params:", params);
					// Display the message using the responseLookups.
					if(params.msg){
						let text = "";
						if(login.responseLookups[params.msg]){ text = login.responseLookups[params.msg]; }
						else{ text = params.msg ; }
						alert( text );
					}
			
					// Clear the search.
					let loc = window.location.href;
					if(loc.indexOf("?")){
						loc = loc.split("?")[0];
						history.replaceState(null, document.title, loc);
					}
				}
			};
		
			try{ await getLoginStatus();     } catch(e){ reject( {"f":"getLoginStatus"    , "e":e } ); return; }
			try{ await addFormEvListeners(); } catch(e){ reject( {"f":"addFormEvListeners", "e":e } ); return; }
			try{ await getMsgs();            } catch(e){ reject( {"f":"getMsgs"           , "e":e } ); return; }

			resolve();
		});
	},
};

window.onload = async function(){
	window.onload = null;

	// Init.
	try{ await login.init(); } 
	catch(e){ 
		let msg = `Error during login init.\n\n${JSON.stringify(e)}`;
		alert(msg);
		console.log(msg);
		return; 
	}
};