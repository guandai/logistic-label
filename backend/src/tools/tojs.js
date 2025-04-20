const fs = require('fs');

// Function to read JSON data from a file
const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Function to merge the stateData and geoData
const mergeData = (stateData, geoData) => {
  // Create a map of zip codes in stateData for quick lookup
  const stateDataZipMap = new Map();
  stateData.forEach(record => {
    stateDataZipMap.set(record.zip, record);
  });

  // Merge geoData into stateData where zip code is not present in stateData
  geoData.forEach(record => {
    if (!stateDataZipMap.has(record.zip_code)) {
      stateData.push({
        zip: record.zip_code,
        city: record.city,
        state_name: record.state,
        county_name: record.county,
        timezone: null // or any default value as timezone is not present in geoData
      });
    }
  });

  return stateData;
};

// Main function to load, merge and print the data
const main = async () => {
  try {
    const stateData = await readJSONFile('stateData.json');
    const geoData = await readJSONFile('geoData.json');

    const mergedData = mergeData(stateData, geoData);
    console.log('>>mergedData'.mergedData);
  } catch (error) {
    console.error('Error reading or processing files:', error);
  }
};

main();
