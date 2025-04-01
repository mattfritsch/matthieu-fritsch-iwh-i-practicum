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

const customObjectGetUrl = `https://api.hubapi.com/crm/v3/objects/${customObjectId}`;

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

    const url = `${customObjectGetUrl}?${params.toString()}`;

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

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));