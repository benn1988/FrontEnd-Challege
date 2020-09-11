# FrontEnd Challege
1. Please clone this page - Time for this should be 15mins
Explain how you would copy/clone/ripp this page and make it work on your local environment

npm install website-scraper website-scraper-puppeteer

    const scrape = require('website-scraper');
    const PuppeteerPlugin = require('website-scraper-puppeteer');

    scrape({
        urls: ['https://www.instagram.com/gopro/'],
        directory: '/path/to/save',
        plugins: [ 
          new PuppeteerPlugin({
            launchOptions: { headless: false }, /* optional */
            scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
            blockNavigation: true, /* optional */
          })
        ]
    });

1.a. Explain your method?  
https://github.com/website-scraper/website-scraper-puppeteer

1.b. How you would minimize the errors?  
Open the file on a local development server, and make sure that everything is loading and it looks exactly the same as on the original page, and there are no errors in the console

1.c. If you would need to eliminate a scripts explain why  
Remove all the tracking scripts(Google, Bing, Hotjar, Wistia etc), no need of them on local environment plus they might be a source of console errors

1.d. If you would replace scripts explain how & why  
1.e. Clone the the page
https://www.beautystatcosmetics.com/en/pre-6.html

2. There are three different sizes of browser; desktop, tablet and mobile.
Please check out the images below which represent desktop, tablet and mobile respectively.
Please complete them in one single responsive HTML structure, note that you are freely to use any css frameworks

3. Here is a free API, build a simple site/app where a user can search an artist by using keywords.
Then if the user clicks on the Artist, it will display It’s album list plus any other information you want to show.
https://www.theaudiodb.com/api_guide.php
