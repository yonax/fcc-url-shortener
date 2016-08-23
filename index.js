const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const path = require('path');

const db = require('./db');
const app = express();

const baseURL = process.env.BASE_URL;

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/:shortUrl', function(request, response) {
    const id = parseInt(request.params.shortUrl, 10); 
    if (!id) {
        response.sendFile(path.resolve(__dirname, 'index.html'));
        return;
    }
    db.fetch(id).then(original => {
        if (original)  {
            response.redirect(original);
        } else {
            response.status(404).json({
                error: 'not found'
            });
        }
    })
});

app.post('/', function (request, response) {
    const original = request.body.url;
    if (!validUrl.isWebUri(original)) {
        response.status(400).json({
            error: 'not a web uri'
        });
    } else {
        db.insert(original).then(id => {
            response.json({
                original_url: original,
                short_url: `${baseURL}${id}`
            });
        })
    }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
