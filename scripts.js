// This is a chrome extension that displays 
// a random woman in STEM with each new tab.

// if unable to retrieve info online, display local image
var getLocalFem = function(callback) {
	console.log("getLocalFem");
	var random = Math.floor((Math.random() * 4));

	var img = "/imgs/" + random + ".jpg";
	callback("", "", img, "");
}

// load the list of fems
var getFemList = function() {
	// load list of fems
	$.get("radfems.txt")
	.done(function(femlist) {
		var femlist = femlist.split(/[\n,]+/);
		console.log("getFemList success");
		randomFem(femlist, callback);
	})
	.fail(function() {
		console.log("getFemList error");
	})
	.always(function() {
		console.log("getFemList complete");
	})
}

// get a random fem from the list
var randomFem = function(femlist, callback) {
	var random = Math.floor((Math.random() * femlist.length));
	var fem = femlist[random];
	while (fem == "") {
		fem = femlist[random];
	};
	getFemInfo(fem, callback);
}

// get info from wikipedia for the fem
var getFemInfo = function(fem, callback) {

	var wikiAPI = "https://en.wikipedia.org/w/api.php?";
	var test = $.getJSON( wikiAPI, {
		format: "json",
		action: "query",
		prop: "extracts|pageimages",
		exintro: "",
		titles: fem,
		piprop: "original",
		redirects: "true"
	})

	// process info from wikipedia
	.done(function(test) {
		// console.log("wikipedia info retrieved");
		$.each(test.query.pages, function(index, value) {
			var id = index;
			var extract = value.extract;

			// get new fem if fem is not in wikipedia
			if (id == "-1") {
				updateFem();
			};

			// limit amount of text to display to keep page legible. 
			// ensure text does not cut off in the middle of a paragraph.
			if (extract.length > 1200) {
				extractArray = extract.split(/(<[^>]*>)/);
				extract = "";
				var chars = 0;
				var stop = 0;
				// display up to 1200 chars of content - disregard html tags
				extractArray.forEach(function(item) {
					chars = chars + item.length;
					if (item == "" || item[0] == "<") {
						extract = extract + item;
						chars = chars - item.length;
					} else if (chars <= 1200 && stop == 0) {
						extract = extract + item;
						chars = chars + item.length;
					} else {
						stop = extractArray.indexOf(item);
					};
				});
			};

			// display text only if no image is available from wikipedia
			if ("undefined" === typeof value.thumbnail) {
				var img = "";
			} else {
				var img = value.thumbnail.original;
			};
			callback(id, fem, img, extract);
		})
	})
	.fail(function() {
		console.log("getFemInfo error");
		getLocalFem(callback);
	})
	.always(function() {
		console.log("getFemInfo complete");
	})
}

// update new tab with info
var updateFem = function() {
	callback = function(id, fem, img, extract) {
		// format page for text only, text+image, or image only layout
		if (img == "") {
			$(".tab").addClass("onecol");
			$("#imgdiv").remove();
		} else if (img[0] == "/") {
			$(document.body).css("background", "url(" + img + ") no-repeat center center fixed");
			$("#imgdiv").remove();
		} else {
			$(".tab").addClass("twocol");
			$("#img").attr("src", img);
		}

		// display summary on new tab page
		if (extract != "") {
			$("#summary").html(extract);
		}

		// display fem name on new tab page
		if (fem != "") {
			$("#title").text(fem);
		}
		
		// update more info URL
		if (id != "") {
			var newUrl = "https://en.wikipedia.org/?curid=" + id;
			$("#moreinfo").attr("href", newUrl).html("Read more on Wikipedia");	
		}

	};
	getFemList(callback);
}

$(document).ready(function() {
	console.log("begin")
	updateFem();
})