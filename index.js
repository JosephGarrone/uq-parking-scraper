var CronJob = require('cron').CronJob;

var scraper = require('./src/scraper.js');
var config = require('./src/config.js');

var cron = new CronJob(config.cron, scraper.scrape, scraper.finished, true, config.timezone);
