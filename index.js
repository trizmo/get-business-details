// Import required modules
const fetch = require('node-fetch');
const fs = require('fs');

// Cheerio Version of findEmail
const findEmail = require('./findEmail');

// Puppeteer Version of findEmail
const findEmailPupp = require('./findEmailPuppeteer');

// Convert to CSV and save to file
const convertToCsv = require('./convertToCsv');

// Load environment variables
require('dotenv').config({
    // Keep your api key in secrets/.env
    // We'll need GOOGLE_API_KEY saved here
    path: './secrets/.env'
});

// Starting Script
console.log("==================");
console.log("Running Places API");
console.log("==================");

// Settings
const zipCode = '90603';
const types = ['liquor_store']

async function getPlaceDetails(placeId, apiKey) {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,photos&key=${apiKey}`;

    const response = await fetch(detailsUrl);
    const data = await response.json();

    return {
        // name: data.result.name,
        // address: data.result.formatted_address,
        phoneNumber: data.result.formatted_phone_number || 'N/A',
        website: data.result.website || 'N/A',
    };
}

async function run() {
    // delete placeDetails.json if it exists
    if (fs.existsSync('placeDetails.json')) {
        fs.unlinkSync('placeDetails.json');
    }

    // Variables
    const apiKey = process.env.GOOGLE_API_KEY;
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const query = `query=businesses+in+${zipCode}`;

    // URL
    const url = `${baseUrl}?${query}?&types=${types.join('|')}&key=${apiKey}`;

    let placeDetailsArray = [];

    try {
        // Fetch API call
        const response = await fetch(url);
        const data = await response.json();

        // Check response status
        if (response.ok) {
            for (const place of data.results) {
                const placeId = place.place_id;
                const name = place.name;
                const address = place.formatted_address;
                const business_status = place.business_status;
                const coordinates = place.geometry.location;
                const types = place.types;
                const rating = place.rating;


                // Fetch additional details
                const additionalPlaceDetails = await getPlaceDetails(placeId, apiKey);


                // Create place details object
                const placeDetails = {
                    name,
                    address,
                    business_status,
                    coordinates,
                    types,
                    rating,
                    ...additionalPlaceDetails,
                };

                // Push to array
                placeDetailsArray.push(placeDetails);
            }

            // Write JSON array to file
            fs.writeFileSync('placeDetails.json', JSON.stringify(placeDetailsArray, null, 2));
            console.log('Saved data to placeDetails.json');

            console.log("Running find emails")
            let dataWithEmail = await findEmailPupp()

            console.log("Running convert to csv")
            convertToCsv(dataWithEmail, zipCode);

        } else {
            // Log error message
            console.log('Error:', data.error_message);
        }
    } catch (error) {
        // Log any error that occurred during the fetch
        console.log('An error occurred:', error);
    }
}

// Execute run function
run();
