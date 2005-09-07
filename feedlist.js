var active_feed_id = 666;
var active_offset;

function viewfeed(feed, skip, subop, doc) {

	if (!doc) doc = parent.document;

	p_notify("Loading headlines...");

	enableHotkeys();

	var searchbox = doc.getElementById("searchbox");

	if (searchbox) {
		search_query = searchbox.value;
	} else {
		search_query = "";
	} 

	var viewbox = doc.getElementById("viewbox");

	var view_mode;

	if (viewbox) {
		view_mode = viewbox.value;
	} else {
		view_mode = "All Posts";
	}

	setCookie("ttrss_vf_vmode", view_mode);

	var limitbox = doc.getElementById("limitbox");

	var limit;

	if (limitbox) {
		limit = limitbox.value;
		setCookie("ttrss_vf_limit", limit);
	} else {
		limit = "All";
	}

	active_feed_id = feed;
	active_offset = skip;

	document.getElementById("ACTFEEDID").innerHTML = feed;

	setCookie("ttrss_vf_actfeed", feed);

	if (subop == "MarkAllRead") {

		var feedr = document.getElementById("FEEDR-" + feed);
		var feedt = document.getElementById("FEEDT-" + feed);
		var feedu = document.getElementById("FEEDU-" + feed);

		feedu.innerHTML = "0";

		if (feedr.className.match("Unread")) {
			feedr.className = feedr.className.replace("Unread", "");
		}
	}

	var query = "backend.php?op=viewfeed&feed=" + param_escape(feed) +
		"&skip=" + param_escape(skip) + "&subop=" + param_escape(subop) +
		"&view=" + param_escape(view_mode) + "&limit=" + limit;

	if (search_query != "") {
		query = query + "&search=" + param_escape(search_query);
	}
	
	var headlines_frame = parent.frames["headlines-frame"];

//	alert(headlines_frame)

	headlines_frame.location.href = query + "&addheader=true";

	cleanSelected("feedsList");
	var feedr = document.getElementById("FEEDR-" + feed);
	if (feedr) {
		feedr.className = feedr.className + "Selected";
	}
	
	disableContainerChildren("headlinesToolbar", false, doc);

//	notify("");

}


