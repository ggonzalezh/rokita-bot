
const puppeteer = require('puppeteer');
const { sendMessage} = require('../discord/message')
const { sendErrorConsole } = require('../helper/utils')
const config = require('../../config.json')

exports.searchItemInWiki = (message, args) => {
    if (!args[1]) {
        sendMessage('falto el nombre del item', message);
        return;
    }
    let itemName = "";

    for (let i = 1; i < args.length; i++) {
        let item = args[i];
        itemName = itemName + " " + item.charAt(0).toUpperCase() + item.slice(1);
    }

    let channel = message.channel;
    let guildName = message.guild.name;

    let itemUrlPart = convertStringToUrl(itemName.trim());
    let url = config.puppeteer.wikiURL + itemUrlPart;

    getImage(url, guildName).then(result => {
        let outputString = `<${url}>`;

        if (!result.success) {
            sendMessage(`error **${itemName}**`, message);
            return;
        }
        if (result.textblock) {
            outputString += `\n${result.textblock}`;
        }

        if (!result.screenshot) {
            return;
        }
        channel.send(outputString, { files:[{
                attachment:  result.screenshot
            }]});
    }).catch((err) => {
        sendMessage(`error en la búsqueda del item`, message)
        sendErrorConsole(err);
    });

};



let convertStringToUrl = (itemName) => {
    return itemName.replace(/ /g, '_');
};

let getImage = async (url) => {
    let output = {
        screenshot: false,
        success: false
    };

    const browser = await puppeteer.launch({
        ignoreHTTPSError: true,
        headless: true,
        handleSIGHUP: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(config.puppeteer.enableJavascript);
    await page.setViewport({ 'width': config.puppeteer.width, 'height': config.puppeteer.height });

    try {
        await page.goto(url, { waitUntil: 'load' });
    } catch (error) {
        return output;
    }

    const invalidPage = await page.$(config.puppeteer.wikiInvalidPageSelector);
    if (invalidPage && invalidPage !== null) return output;

    output.success = true;

    let paragraphs = await page.$(config.puppeteer.wikiParagraphsSelector);
    if (await paragraphs.$(config.puppeteer.wikiInfoboxPageContainerSelector))
        output.textblock = await page.evaluate(() => document.querySelector('#mw-content-text > .mw-parser-output > p:nth-of-type(2)').innerText);
    else
        output.textblock = await page.evaluate(() => document.querySelector('#mw-content-text > .mw-parser-output > p:nth-of-type(1)').innerText);

    output.textblock = output.textblock.replace(/[\n\r]/g, '');

    async function getScreenshot(selector) {
        const element = await page.$(selector);
        if (!element)
            return;

        let screenshot = await element.screenshot();
        await page.close();
        await browser.close();
        return screenshot;
    }

    output.screenshot = await getScreenshot(config.puppeteer.wikiItemBoxSelector);
    if (output.screenshot) return output;

    await page.close();
    await browser.close();
    return output;
}