const express = require('express');
const axios = require('axios');
const app = express();
const pug = require('pug');
const dotenv = require('dotenv');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.API_KEY;
const customObjectId = process.env.CUSTOM_OBJECT_ID;

const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${customObjectId}`;

const homepageView = pug.compileFile('./views/homepage.pug');
const formView = pug.compileFile('./views/updates.pug');

app.get('/', async (req, res) => {
    const properties = [
        'name',
        'artist',
        'category'
    ];

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    const params = new URLSearchParams();
    properties.forEach(prop => params.append('properties', prop));
    params.append('limit', '100');

    const url = `${customObjectUrl}?${params.toString()}`;

    try {
        const resp = await axios.get(url, { headers });
        const response = resp.data.results;

        res.send(homepageView({
            title: 'Homepage |  Integrating With HubSpot I Practicum',
            response: response
        }))

    } catch (error) {
        console.error(error);
    }

});

app.get('/update-cobj', async (req, res) => {
    res.send(formView({
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    }))
})

app.post('/update-cobj', async (req, res) => {
    const data = {
        properties: {
            name: req.body.name,
            artist: req.body.artist,
            category: req.body.category
        }
    }

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(customObjectUrl, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
})


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));