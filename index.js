
function deleteAllTattles_byFilter(appfilter) {
	var callback = function(resp) {
		hideMainView();
		getfilters();
		getTattleList(getActiveFilter());
	};

	var thedata = {
		o: "deleteAllTattles_byFilter",
		appfilter:appfilter,
	};

	serverPOSTrequest(thedata, callback);
}


// DONE
function setCurrentFilter(newfilter) {
	// Remove the active filter from all.
	document.querySelectorAll('#filterButtons1_container .filterButtons1').forEach(function(d, i) {
		d.classList.remove('active');
	});

	// Add the active filter
	document.querySelectorAll('#filterButtons1_container .filterButtons1').forEach(function(d, i) {
		if (d.name == newfilter) {
			d.classList.add('active');
		}
	});
}
function getfilters() {
	// Refresh button list of active filters.

	// Get new filter values.
	var callback = function(resp) {
		// console.log("getfilters:", resp, JSON.parse(resp));
		resp = JSON.parse(resp);

		var filterContainer = document.querySelector('#filterButtons1_container');

		// Remove all filter buttons.
		document.querySelectorAll('#filterButtons1_container .filterButtons1').forEach(function(d, i) {
			// d.classList.remove('active');
			d.remove();
		});

		// Don't continue if no filters were returned.
		if(!resp.length){ console.log("no filters!"); return; }

		function newFilterButton(value, name, active) {
			var newBtn = document.createElement('input');
			newBtn.type = "button";
			newBtn.value = value;
			newBtn.name = name;
			newBtn.setAttribute("onclick", "setCurrentFilter('" + name + "'); getTattleList('" + name + "');");
			newBtn.classList.add('filterButtons1');
			if (active) {
				newBtn.classList.add('active');
			}
			return newBtn;
		}

		// Create the 'No filter' button.
		// var newBtn = newFilterButton('No filter', 'nofilter', true);
		// filterContainer.appendChild(newBtn);

		// Create the rest of the new filter buttons from retrieved filter values.

		newBtn = newFilterButton(resp[0].appfilter, resp[0].appfilter, true);
		filterContainer.appendChild(newBtn);
		newBtn.click();

		for (var i = 1; i < resp.length; i++) {
			newBtn = newFilterButton(resp[i].appfilter, resp[i].appfilter, false);
			filterContainer.appendChild(newBtn);
		}

		// <input type="button" name="A" class="filterButtons1 active" value="No filter(22)"><br>
	};

	var thedata = {
		o: "getfilters",
	};

	serverPOSTrequest(thedata, callback);

}
function getActiveFilter() {
	// The filter will be stored in a DOM object. Get it and return it.
	var activeFilter;
	document.querySelectorAll('#filterButtons1_container .filterButtons1').forEach(function(d, i) {
		if (d.classList.contains('active')) {
			activeFilter = d.name;
			// d.classList.add('active');
			// console.log("Active filter:", d.name);
		}
	});
	return activeFilter;
}
function createElement_NRA(tagObj) {
	// Create the new DOM element.
	var newElement = document.createElement(tagObj.tag);
	// Set all attributes of the new DOM element.
	for (var attr in tagObj.attributes) {
		if (tagObj.attributes[attr] != null) {
			newElement.setAttribute(attr, tagObj.attributes[attr]);
		}
	}
	// Set the innerHTML of the new DOM element.
	newElement.innerHTML = tagObj.html;
	// Return the not-yet-attached new DOM element.
	return newElement;
}
function addTattleToList(id, date, smsg, appfilter) {
	// Create a tattle container and all the divs within it.
	// Set the proper class attributes for each div.
	// Add text to 2 divs.
	var tattle_record_container = createElement_NRA({
		"tag": "div",
		"attributes": {
			"class": "tattle_record_container",
			"onclick": "openTattle(" + id + "); "
		},
		"html": ""
	});
	var color_bar = createElement_NRA({
		"tag": "div",
		"attributes": {
			"class": "color_bar"
		},
		"html": appfilter
	});
	var delete_tattle = createElement_NRA({
		"tag": "div",
		"attributes": {
			"class": "delete_tattle",
			"onclick": "deleteTattle(" + id + "); window.event.stopPropagation();"
		},
		"html": ""
	});
	var brief_tattle_info = createElement_NRA({
		"tag": "div",
		"attributes": {
			"class": "brief_tattle_info"
		},
		"html": "#" + id + "<br>" + date + "<br>"
	});
	var short_msg = createElement_NRA({
		"tag": "div",
		"attributes": {
			"class": "short_msg"
		},
		"html": smsg
	});

	// Attach the divs to the container div.
	tattle_record_container.appendChild(color_bar);
	tattle_record_container.appendChild(delete_tattle);
	tattle_record_container.appendChild(brief_tattle_info);
	tattle_record_container.appendChild(short_msg);

	// Attached the container div to the DOM.
	document.getElementById('rightsidebar').querySelector('.contents').appendChild(tattle_record_container);
}
function openTattle(id) {
	var callback = function(resp) {
		var thisTattle = JSON.parse(resp)[0];
		var parsedData = {};

		// top_smsg
		// top_id
		// top_date
		// top_status

		parsedData['smsg'] = (thisTattle['shortmsg']);
		parsedData['lmsg'] = JSON.parse(thisTattle['longmsg']);
		parsedData['post'] = JSON.parse(thisTattle['post']);
		parsedData['get'] = JSON.parse(thisTattle['get']);
		parsedData['request'] = JSON.parse(thisTattle['request']);
		parsedData['session'] = JSON.parse(thisTattle['session']);
		parsedData['files'] = JSON.parse(thisTattle['files']);
		parsedData['server'] = JSON.parse(thisTattle['server']);
		parsedData['backtrace'] = JSON.parse(thisTattle['backtrace']);
		parsedData['thedate'] = (thisTattle['thedate']);
		// parsedData['user']		= (thisTattle['user']);
		parsedData['id'] = (thisTattle['id']);

		document.getElementById('top_smsg').innerHTML = parsedData['smsg'];
		document.getElementById('top_id').innerHTML = parsedData['id'];
		document.getElementById('top_date').innerHTML = parsedData['thedate'];
		// document.getElementById('top_status').innerHTML  = parsedData['status'] ;

		document.getElementById('section_lmsg').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['lmsg'], null, 2) + "</pre>";
		// 			document.getElementById('section_lmsg').querySelector('.contents').innerHTML      = "<pre>"+(parsedData['lmsg'])+"</pre>" ;

		// 			document.getElementById('section_lmsg').querySelector('.contents').innerHTML      = "<pre>"+	parsedData['lmsg']+"</pre>" ;
		document.getElementById('section_post').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['post'], null, 1) + "</pre>";
		document.getElementById('section_get').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['get'], null, 1) + "</pre>";
		document.getElementById('section_request').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['request'], null, 1) + "</pre>";
		document.getElementById('section_session').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['session'], null, 1) + "</pre>";
		document.getElementById('section_files').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['files'], null, 1) + "</pre>";
		document.getElementById('section_server').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['server'], null, 1) + "</pre>";
		document.getElementById('section_backtrace').querySelector('.contents').innerHTML = "<pre>" + JSON.stringify(parsedData['backtrace'], null, 1) + "</pre>";
		// document.getElementById('section_server').querySelector('.contents').innerHTML    = parsedData['thedate'] ;
		// document.getElementById('section_server').querySelector('.contents').innerHTML    = parsedData['user'] ;
		// document.getElementById('section_server').querySelector('.contents').innerHTML    = parsedData['id'] ;

		showMainView();
		// document.getElementById('sidebar_container').style['z-index'] = 0;
		// document.getElementById('mainviewingarea').style['display'] = "none";
		// document.getElementById('mainviewingarea').style['display'] = "block";
		document.getElementById('section_lmsg').scrollIntoView(true);
	};

	var thedata = {
		o: "openTattle",
		id: id,
	};

	serverPOSTrequest(thedata, callback);
}
function deleteTattle(id) {
	var callback = function(resp) {
		hideMainView();
		getTattleList(getActiveFilter());
	};

	var thedata = {
		o: "deleteTattle",
		id: id,
	};

	serverPOSTrequest(thedata, callback);
}
function serverPOSTrequest(dataObj, callback) {
	// Display the progress animation.
	document.getElementById('statusbuttonswrapper_progressbar').classList.add('show');

	var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
	xmlhttp.open("POST", "index_p.php");
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status == "200") {
			// Hide the progress animation.
			document.getElementById('statusbuttonswrapper_progressbar').classList.remove('show');
			// Run the callback.
			callback(xmlhttp.responseText);
		}
	}

	var dataObj = Object.keys(dataObj).map(function(k) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(dataObj[k])
	}).join('&')

	xmlhttp.send(dataObj);
}
function clearTattleList() {
	document.getElementById('rightsidebar').querySelector('.contents').innerHTML = "";
}
function hideMainView() {
	document.getElementById('mainviewingarea').classList.add('hide');
	document.getElementById('mainviewingarea_X').classList.remove('show');
}
function showMainView() {
	document.getElementById('mainviewingarea').classList.remove('hide');
	document.getElementById('mainviewingarea_X').classList.add('show');
}
window.onload = function() {
	getfilters();
};
function getTattleList(appfilter) {
	// console.warn("appfilter:", appfilter);
	var callback = function(resp) {
		clearTattleList();

		var newdata = JSON.parse(resp);

		for (var i = 0; i < newdata.rows.length; i++) {
			addTattleToList(newdata.rows[i].id, newdata.rows[i].thedate, newdata.rows[i].shortmsg, newdata.rows[i].appfilter);
		}
	};

	var thedata = {
		o: "getTattleList",
		appfilter: appfilter,
	};

	serverPOSTrequest(thedata, callback);
}
function deleteAllTattles(appfilter) {
	var callback = function(resp) {
		hideMainView();
		getfilters();
		getTattleList(getActiveFilter());
	};

	var thedata = {
		o: "deleteAllTattles"
	};

	serverPOSTrequest(thedata, callback);
}