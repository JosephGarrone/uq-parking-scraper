var cheerio = require('cheerio');
var request = require('request');

var config = require('./config.js');

function scrape() {
    request(config.source, function (err, response, body) {
        if (err) {
            console.log(err);
            return;  
        }  
        
        var $ = cheerio.load(body);
        
        var parking = [];
        
        $(`${config.selectors.table} ${config.selectors.row}`).each(function (index, row) {
            var title = $(row).find(config.selectors.title).text().trim();
            var data = $(row).find(config.selectors.data).map(function (index, cell) {
                return $(this).text();
            }).get().join('').trim();
            
            if (title.length != 0 && data.length != 0) {
                parking.push({
                    rawName: title,
                    name: config.parkingAlias[title.toLowerCase()],
                    parks: data
                })
            }
        });
        
        parking.forEach(function(park, index) {
           console.log(`Got ${park.name} with ${park.parks} free`); 
        });
    })
}

function finished() {
    
}

exports = module.exports = {
    scrape: scrape,
    finished: finished
}