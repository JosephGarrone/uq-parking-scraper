var cheerio = require('cheerio');
var request = require('request');
var Sequelize = require('sequelize');

var config = require('./config.js');

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
        logging: console.log
    }
);

var CarPark = sequelize.define('car_parks', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
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
        field: 'id'
    },
    car_park: Sequelize.INTEGER,
    available: Sequelize.INTEGER,
    time: Sequelize.DATE
});

function scrape() {
    request(config.source, function (err, response, body) {
        if (err) {
            console.log(err); 
            return;  
        } 

        var $ = cheerio.load(body);
        
        $(`${config.selectors.table} ${config.selectors.row}`).each(function (index, row) {
            var title = $(row).find(config.selectors.title).text().trim().toLowerCase();
            var data = $(row).find(config.selectors.data).map(function (index, cell) {
                return $(this).text();
            }).get().join('').trim();
            var casual = $(row).find(config.selectors.casual).length;
            
            if (title.length != 0 && data.length != 0) {
                CarPark.create({
                    data_name: title,
                    name: config.parkingAlias[title],
                    active: true,
                    casual: casual
                }).then(function(park) {
                    console.log(park);
                })
                
                CarPark.findOrCreate({
                    where: {
                        data_name: title
                    }, 
                    defaults: {
                        data_name: title,
                        name: config.parkingAlias[title],
                        active: true,
                        casual: casual
                    }
                }).then(function (carPark, err) {
                    CarParkInfo.create({
                        car_park: carPark[0].get({ plain: true }).id,
                        available: data,
                        time: new Date()
                    })
                });
            }
        });
        
        console.log("Data fetch complete.");
    })
}

function finished() {
    
}

exports = module.exports = {
    scrape: scrape,
    finished: finished
}
