const puppeteer = require('puppeteer');
var fs = require('fs');


(async () => {
	try {
		// open the headless browser
		var browser = await puppeteer.launch({ headless: false });
		// open a new page
		var page = await browser.newPage();
		// enter url in page
		await page.goto(`https://dequeuniversity.com/checklists/web/page-title`);
		await page.waitForSelector('td.td-technique');

		var techniques = await page.evaluate(() => {
			var technique = document.querySelectorAll(`td.td-technique`);
			var wcag = document.querySelectorAll(`td.td-wcag-sc`);
			var link = document.querySelectorAll(`td.td-wcag-sc > a`);

			var techniqueArray = [];
			for (var i = 0; i < technique.length; i++) {
				var wcagLink;
				if (link[i]) {
					wcagLink = link[i].href;
				} else {
					wcagLink = 'no link';
				}
				techniqueArray[i] = {
					title: technique[i].innerText.trim(),
					link: wcagLink,
					wcag: wcag[i].innerText.trim()
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
