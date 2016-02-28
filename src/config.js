exports = module.exports = {
    source: "https://pg.pf.uq.edu.au/embedded",
    timezone: "Australia/Brisbane",
    cron: '*/10 * * * * *',
    parkingAlias: {
        "p12": "Daycare",
        "p11 l1": "Conifer L1 (Staff)",
        "p11 l2": "Conifer L2 (Staff)",
        "p11 l3": "Conifer L3 (Students)",
        "p10": "UQ Centre",
        "p9": "Boatshed Open",
        "p8 l1": "Boatshed Bottom",
        "p8 l2": "Boatshed Top",
        "p7": "Dustbowl",
        "p6": "BSL Short Term",
        "p5": "P5",
        "p4": "Multi Level 3",
        "p3": "Multi Level 2",
        "p2": "Multi Level 1",
        "p1": "Warehouse"
    },
    selectors: {
        table: "body table",
        row: "tr",
        title: "td.zone",
        data: "td.casual, td.permit",
        casual: ".casual"
    },
    database: {
        host: "127.0.0.1",
        port: 3306,
        username: "uq_parking",
        password: "uq_parking",
        database: "uq_parking"
    }
}