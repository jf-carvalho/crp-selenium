const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

const options = new chrome.Options()
options.addArguments('--headless')

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build()


const crp = process.argv[2]

init(crp)  

async function init(crp) {
    validateCRP(crp)
    crp = formatCrp(crp)

    await driver.get('https://cadastro.cfp.org.br/')

    sleep(2)

    await clickAdvancedSearchButton()

    sleep(2)

    await setCRPField(crp)

    sleep(2)

    await clickSearchButton()

    sleep(2)

    const results = await getResults()

    driver.quit()
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
            until.elementLocated(By.css('#resultados')),
            15000
        )
    
        // const tableRows = await resultsTable.findElements(By.css('tr'))
    
        // console.log(tableRows)
        console.log(resultsTable)
    } catch (error) {
        handleError(error)
    }
}

async function handleError(error) {
    console.error('\n\x1b[31mERROR:\x1b[0m %s\n', error.message)
    process.exit()
}

function sleep(seconds) {
    new Promise(resolve => setTimeout(resolve, seconds * 1000))
}