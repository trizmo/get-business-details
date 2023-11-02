const fs = require('fs');

module.exports = (data, zipcode) => {
    const header = ["name", "address", "business_status", "lat", "lng", "types", "rating", "phoneNumber", "website", "email"];
    let csv = header.join(",") + "\n";

    for (let item of data) {
        let row = [
            `"${item.name}"`,
            `"${item.address}"`,
            `"${item.business_status}"`,
            item.coordinates.lat,
            item.coordinates.lng,
            `"${item.types.join(";")}"`,  // Concatenating array values by `;`
            item.rating,
            `"${item.phoneNumber}"`,
            `"${item.website}"`,
            `"${item.email}"`
        ];
        csv += row.join(",") + "\n";
    }

    const date = new Date().toISOString();  // Getting the current date in iso format
    const filePath = `./data/leads_${zipcode}_${date}.csv`;

    fs.writeFileSync(filePath, csv);
    console.log(`Data saved to ${filePath}`);
}