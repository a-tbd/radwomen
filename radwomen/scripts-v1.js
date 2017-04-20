// v1 of js for radwomen project.  I'm including this for those following from my blog


var params = {
	format: 'json',
	action: 'query',
	prop: 'extracts&exintro=&explaintext=',
	titles: 'Ada Lovelace',
	redirects: '1'
};
var str = $.param(params);
console.log(str);

// get info on rad woman from wikipedia
var test = $.getJSON("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Weather&redirects=1")
.done(function(test) {
	console.log("success");
	// extract the summary
	$.each(test.query.pages, function(index, value) {
		console.log(index);
		console.log(value.extract);
		// display summary in page
		$("#hello").html(function(i, origText) {
			return "<p>" + value.extract + "</p>";
		});
	});
})
.fail(function() {
	console.log("error");
})
.always(function() {
	console.log("complete")
});
