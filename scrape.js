const puppeteer = require('puppeteer');
var fs = require('fs');


(async () => {
	try {
		// open the headless browser
		var browser = await puppeteer.launch({ headless: false });
		// open a new page
		var page = await browser.newPage();
        // enter url in page
        var url = `https://dequeuniversity.com/checklists/web/page-title`;

		await page.goto(url);
		await page.waitForSelector('td.td-technique');
        
		var techniques = await page.evaluate(() => {
            var pageTitle = document.title;
			var technique = document.querySelectorAll(`td.td-technique`);
			var wcag = document.querySelectorAll(`td.td-wcag-sc`);
			var link = document.querySelectorAll(`td.td-wcag-sc > a`);
         
			var techniqueArray = [];
			for (var i = 0; i < technique.length; i++) {
				var wcagLink, successCriterion, requiredOrBestPractice;
				if (link[i]) {
                    wcagLink = link[i].href;
                    successCriterion = link[i].innerHTML;
				} else {
                    wcagLink = 'no link';
                    successCriterion = 'not applicable';
                }
                if (wcag[i].innerText.includes("Required")){
                    requiredOrBestPractice = "Required"
                }else {
                    requiredOrBestPractice = "Best Practice"
                }
				techniqueArray[i] = {
                    category: pageTitle.substring(0, pageTitle.indexOf(' |')),
					title: technique[i].innerText.trim(),
					link: wcagLink,
                    required: requiredOrBestPractice,
                    successCriterion: successCriterion
				};
			}
			return techniqueArray;
		});
		// console.log(techniques);
		await browser.close();
		// Writing the techniques inside a json file
		fs.writeFile('deque-checklist-page-title.json', JSON.stringify(techniques), function(err) {
			if (err) throw err;
			console.log('Saved!');
		});
		console.log(success('Browser Closed'));
	} catch (err) {
		// Catch and display errors
		console.log(err);
		await browser.close();
		console.log('Browser Closed');
	}
})();
