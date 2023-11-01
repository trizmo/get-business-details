const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

async function findEmailInWebsite(websiteUrl) {
    try {
        const response = await fetch(websiteUrl);
        const body = await response.text();

        const $ = cheerio.load(body);
        const mailtoLinks = $('a[href^="mailto:"]');

        if (mailtoLinks.length > 0) {
            return mailtoLinks.attr('href').replace('mailto:', '');
        }
    } catch (error) {
        console.log(`Failed to fetch or parse ${websiteUrl}: ${error}`);
    }
    return 'N/A';
}

module.exports = async () => {
    console.log("Finding emails");
    const data = require('./placeDetails.json');

    for (let i = 0; i < data.length; i++) {
        if (data[i].additionalPlaceDetails.website !== 'N/A') {
            console.log(`Checking website ${data[i].additionalPlaceDetails.website} for email...`);
            const email = await findEmailInWebsite(data[i].additionalPlaceDetails.website);

            // Save the found email
            if (email !== 'N/A') data[i].additionalPlaceDetails.email = email;
        }
    }

    // Save updated data back to JSON file
    fs.writeFileSync('./placeDetails.json', JSON.stringify(data, null, 2));
    console.log('Updated email information saved to placeDetails.json');
};