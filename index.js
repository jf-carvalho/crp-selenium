const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const fs = require('fs');

const crp = process.argv[2]
const dev = process.argv[3]

const options = new chrome.Options()

if (dev != "dev") {
    options.addArguments('--headless')
}

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build()

init(crp)  

async function init(crp) {
    validateCRP(crp)
    crp = formatCrp(crp)

    await driver.get('https://cadastro.cfp.org.br/')

    await sleep(2)

    await clickAdvancedSearchButton()

    await sleep(2)

    await setCRPField(crp)

    await sleep(2)

    await clickSearchButton()

    const results = JSON.stringify(await getResults())

    if (dev != "dev") {
        driver.quit()
    }

    fs.writeFileSync('results.json', results);

    return results;
}

function validateCRP(crp) {
    if (crp == undefined) {
        handleError(new Error('Argument CRP is required.'))
    }
}

function formatCrp(crp) {
    if (crp.length == 9) {
        crp = crp.substring(3)
    }

    if (crp.length == 8) {
        crp = crp.substring(2)
    }

    return crp
}

async function clickAdvancedSearchButton() {
    try {
        const button = await driver.wait(
            until.elementLocated(By.css('[data-target="#buscaAvancada"]')),
            5000
        )

        await button.click()
    } catch (error) {
        await handleError(error)
    }
}

async function setCRPField(crp) {
    try {
        const inputElement = await driver.wait(
            until.elementLocated(By.id('registroconselho')),
            5000
        )

        await driver.wait(until.elementIsVisible(inputElement, 5000))
      
        await inputElement.sendKeys(crp)
    } catch (error) {
        await handleError(error)
    }
}

async function clickSearchButton() {
    try {
        const searchSpanElement = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(), 'Buscar')]")),
            5000
        )

        const searchButton = await searchSpanElement.findElement(By.xpath("./ancestor::button"))

        await searchButton.click()
    } catch (error) {
        await handleError(error)
    }
}

async function getResults() {
    try {
        const resultsTable = await driver.wait(
            until.elementLocated(By.css('.resultados table')),
            15000
        )

        await driver.wait(until.elementIsVisible(resultsTable, 5000))
    
        const tableRows = await resultsTable.findElements(By.css('tbody tr'))
    
        const professionals = [];

        for (const tableRow of tableRows) {
            const cols = await tableRow.findElements(By.css('td'));
            const professional = {
                "status": await cols[0].getText(),
                "name": await cols[1].getText(),
                "region": await cols[2].getText(),
                "registration_number": await cols[3].getText(),
                "subscription_date": await cols[4].getText()
            };

            professionals.push(professional);
        }

        return professionals
    } catch (error) {
        handleError(error)
    }
}

async function handleError(error) {
    console.error('\n\x1b[31mERROR:\x1b[0m %s\n', error.message)
    process.exit()
}

async function sleep(seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000))
}