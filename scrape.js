const puppeteer = require('puppeteer');
var fs = require('fs');

(async () => {
	try {
		// open the headless browser
		var browser = await puppeteer.launch({ headless: false });
		// open a new page
		var page = await browser.newPage();
		// enter url in page
		var completeArray = [];
		var urlList = [
			'https://dequeuniversity.com/checklists/web/page-title',
			'https://dequeuniversity.com/checklists/web/language',
			'https://dequeuniversity.com/checklists/web/headings',
			'https://dequeuniversity.com/checklists/web/landmarks',
			'https://dequeuniversity.com/checklists/web/lists',
			'https://dequeuniversity.com/checklists/web/tables',
			'https://dequeuniversity.com/checklists/web/iframes',
			'https://dequeuniversity.com/checklists/web/markup-validity',
			'https://dequeuniversity.com/checklists/web/other-semantics',
            'https://dequeuniversity.com/checklists/web/links',
            'https://dequeuniversity.com/checklists/web/site-navigation',
            'https://dequeuniversity.com/checklists/web/within-page-navigation',
            'https://dequeuniversity.com/checklists/web/reading-focus-order',
            'https://dequeuniversity.com/checklists/web/images',
            'https://dequeuniversity.com/checklists/web/color-contrast',
            'https://dequeuniversity.com/checklists/web/text',
            'https://dequeuniversity.com/checklists/web/visual-cues',
            'https://dequeuniversity.com/checklists/web/output',
            'https://dequeuniversity.com/checklists/web/audiovideo',
            'https://dequeuniversity.com/checklists/web/animation-motion-timed',
            'https://dequeuniversity.com/checklists/web/device-independent-input',
            'https://dequeuniversity.com/checklists/web/form-input-labels-instructions',
            'https://dequeuniversity.com/checklists/web/form-validation-feedback',
            'https://dequeuniversity.com/checklists/web/dynamic',
            'https://dequeuniversity.com/checklists/web/custom-widgets',
            'https://dequeuniversity.com/checklists/web/captcha'
		];
		for (let i = 0; i < urlList.length; i++) {
			var current = urlList[i];
			await page.goto(current);
			await page.waitForSelector('td.td-technique');

			var techniques = await page.evaluate(() => {
				var techniqueArray = [];
				var pageTitle = document.title;
				var technique = document.querySelectorAll(`td.td-technique`);
				var wcag = document.querySelectorAll(`td.td-technique~td`);
				//var link = document.querySelectorAll(`td.td-wcag-sc > a`);

				for (var i = 0; i < technique.length; i++) {
					var wcagLink, successCriterion, requiredOrBestPractice, details;

					if (wcag[i]) {
						if (wcag[i].innerHTML.includes('Multiple')) {
                            requiredOrBestPractice = 'Required';
                            successCriterion = 'multiple';
                        } 
                        else if (wcag[i].innerHTML.includes('Required')){
                            requiredOrBestPractice = 'Required';
                        }
                        else {
							requiredOrBestPractice = 'Best Practice';
						}
						if (wcag[i].innerHTML.includes('http')) {
							var innerHTML = wcag[i].innerHTML;
							wcagLink = innerHTML.substring(innerHTML.indexOf('https'), innerHTML.indexOf('">W'));
							successCriterion = innerHTML
								.substring(innerHTML.indexOf('>WCAG'), innerHTML.indexOf('</a>'))
								.slice(1);
						} else {
                            wcagLink = 'no link';
                            if (successCriterion !== 'multiple'){
                                successCriterion = 'not applicable';
                            }
						}
					} else {
						requiredOrBestPractice = 'none';
						wcagLink = 'no link';
						successCriterion = 'not applicable';
					}

					if (technique[i]) {
						details = technique[i].innerText.trim();
					} else {
						details = 'no details';
					}

					techniqueArray.push({
						category: pageTitle.substring(0, pageTitle.indexOf(' |')),
						description: details,
						link: wcagLink,
						required: requiredOrBestPractice,
						successCriterion: successCriterion
					});
				}

				return techniqueArray;
			});
			completeArray.push(techniques);
		}
        await browser.close();
		// Writing the techniques inside a json file
		fs.writeFile('deque-checklist-page-title.json', JSON.stringify(completeArray), function(err) {
			if (err) throw err;
            console.log('Saved!');
		    console.log('Browser Closed');
		});
		
	} catch (err) {
		// Catch and display errors
		console.log(err);
		await browser.close();
		console.log('Browser Closed');
	}
})();
