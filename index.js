const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
// POST endpoint to save data
app.post('/saveData', (req, res) => {
    const { name, storingdata } = req.body;

    if (!name || !storingdata) {
        return res.status(400).json({ error: 'Name and storingdata are required' });
    }

    const newData = { name, storingdata };

    // Load existing data from JSON file
    let existingData = [];
    try {
        existingData = JSON.parse(fs.readFileSync('data.json'));
    } catch (error) {
        // If the file doesn't exist or is empty, existingData will remain an empty array
    }

    // Add new data to existing data
    existingData.push(newData);

    // Write updated data back to JSON file
    fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));

    res.json({ message: 'Data saved successfully' });
});


// GET endpoint to search for a specific name
app.get('/push', (req, res) => {
    const { name } = req.query;

    // Load data from JSON file
    let data = [];
    try {
        data = JSON.parse(fs.readFileSync('data.json'));
    } catch (error) {
        // If the file doesn't exist or is empty, data will remain an empty array
    }

    // Search for the object with the specified name
    const foundData = data.find(item => item.name === name);

    if (foundData) {
        res.json(foundData);
    } else {
        res.status(404).json({ error: 'Data not found for the specified name' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
