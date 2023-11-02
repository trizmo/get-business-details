# Places and Business Details Scraper

## Description

This project aims to scrape places and business details around a specific ZIP code using Google Places API and other supplementary APIs or tools like Puppeteer for web scraping. It gathers information like business names, addresses, phone numbers, emails, and websites. This can be helpful for generating leads, market research, or other data collection purposes.

## Requirements

- **Node.js (v14.x.x or higher)**
- **Google API Key**
- **Puppeteer**
- **Cheerio (As an alertnative to Puppeteer)**


## Installation Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-project-name.git
    ```

2. **Navigate into the project directory:**
    ```bash
    cd your-project-name
    ```

3. **Install the dependencies:**
    ```bash
    npm install
    ```

## Usage

Before running the application, you need to:

- Add your Google API Key to a `.env` file under `secrets/` as `GOOGLE_API_KEY=your_api_key_here`.
- Edit the `index.js` file to specify your types of interest and ZIP code.

Example:
```javascript
const types = ['restaurant', 'cafe'];
const zipCode = '90603';
```

- Review types.json for a list of available types.

After these steps, you can run the application:
```bash
npm start
```

This will output two files under 'data/' directory:
- `placesDetail.json`
- `leads_[zip_code]_[date].csv` 