const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const utilities = require("./utilities");

const download = ( url, filename, callback ) => {
    console.log(`Downloading ${url}...`);
    request(url, (err, response, body) => {
        if ( err ) return callback(err);
        saveURL( filename, body, callback );
    });
}

const saveURL = ( filename, body, callback ) => {
    mkdirp( path.dirname(filename), err => {
        if ( err ) return callback(err);
        fs.writeFile( filename, body, err => {
            if ( err ) return callback(err);
            callback(null, filename, true);
        });
    });
}

function spider( url, callback ) {
    const filename = utilities.urlToFilename( url );
    fs.exists(filename, exists => {
        if ( exists ) return callback(null, filename, false);    
        download( url, filename, callback );
    })
}

spider( process.argv[2], (err, filename, downloaded ) => {
    if ( err ) return console.log( err );
    if (!downloaded ) return console.log( `Complete the download of ${filename}` );
    console.log(`${filename} was already downloaded`);
});