// Scraper for collecting UQ Parking Data

// Dependancies
var cheerio = require('cheerio'); // Parser
var request = require('request'); // HTML Requests
var Sequelize = require('sequelize'); //ORM
var Logger = require('pretty-logger');

var config = require('./config.js');
var log = new Logger(config.logger);

// ORM object so I can add things to the DB
var sequelize = new Sequelize(
    config.database.database, 
    config.database.username, 
    config.database.password,
    {
        define: {
            freezeTableName: true,
            timestamps: false,
            underscored: true
        },
        logging: function() {},
        host: config.database.host
    }
);

var CarPark = sequelize.define('car_parks', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id',
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    data_name: Sequelize.TEXT,
    casual: Sequelize.BOOLEAN,
    active: Sequelize.BOOLEAN
});

var CarParkInfo = sequelize.define('car_park_info', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id',
        autoIncrement: true
    },
    car_park: Sequelize.INTEGER,
    available: Sequelize.INTEGER,
    time: Sequelize.DATE
});

function scrape() {
    // Main function to collect the data
    //log.info("Data fetch started");
    
    request(config.source, function (err, response, body) {
        if (err) {
            console.log(err); 
            return;  
        } 

        var $ = cheerio.load(body);
        
        var info = [];
        var parks = [];
        
        $(`${config.selectors.table} ${config.selectors.row}`).each(function (index, row) {
            var title = $(row).find(config.selectors.title).text().trim().toLowerCase();
            var data = $(row).find(config.selectors.data).map(function (index, cell) {
                return $(this).text();
            }).get().join('').trim();
            var casual = $(row).find(config.selectors.casual).length;
            
            if (isNaN(data)) {
                data = config.textAlias[data.toLowerCase()].toString();
            }
            
            if (title.length != 0 && data.length != 0) {
                parks.push({
                    data_name: title,
                    name: config.parkingAlias[title],
                    active: true, 
                    casual: casual  
                });
                
                info.push({
                    available: data,
                    time: new Date(),
                    car_park: title
                });
            }
        });
        
        saveCarPark(parks, info);
        
        log.info("Data fetch completed");
    })
}

function saveCarPark(parks, info) {
    if (parks.length == 0) {
        saveCarParkInfo(info);
        return;
    }
    
    CarPark.findOrCreate({
        where: {
            data_name: parks[0].data_name
        },
        defaults: parks[0]
    }).then(function(carPark) {
        parks.splice(0, 1);
        saveCarPark(parks, info);
    })
}

function saveCarParkInfo(info) {
    // Splits out the metadata attached
    if (info.length == 0) {
        return;
    } 
    CarPark.findOne({
        where: {
            data_name: info[0].car_park
        }
    }).then(function(carPark) {
        CarParkInfo.create({
            available: info[0].available,
            time: info[0].time,
            car_park: carPark.id
        }).then(function(carParkInfo) {
            info.splice(0, 1);
            saveCarParkInfo(info);
        });
    });
}

function finished() {
    
}

exports = module.exports = {
    scrape: scrape,
    finished: finished
}
