const cheerio = require('cheerio');

// URL defautl
var uri = 'https://www.goldtraders.or.th/Default.aspx';

// Check http server request "HTTP or HTTPS"
const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http = require('http'),
            https = require('https');

        let client = http;

        if (url.toString().indexOf('https') === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(data);
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
};


// param Dom HTML
const chio = (loadDocument) => {
    // load Dom
    const $ = cheerio.load(loadDocument);

    // Report date time
    var spl = $('span[id=DetailPlace_uc_goldprices1_lblAsTime] b font').text().split(' ');

    // Data
    const fruits = {
        dateTime: {
            date: spl[0].replace(/[/]/g,'-'),
            time: spl[2],
            countReport: parseInt(spl[5].replace(/[())]/g,''))
        },
        header: [],
        data: [],
        report: parseInt(spl[5].replace(/[())]/g,'')),
        api:{
            version: "1.0",
            develop_by: "Mr.Pichai Limpanitivat",
            created_at: '1 Aug 2018'
        }
    };

    var dom = $('div[id=DetailPlace_uc_goldprices1_GoldPricesUpdatePanel] table tbody tr');
    var j = 0;
    dom.find('td').each(function (i, ele) {

        let thisValue = $(this).text().replace(/[\n\t\r\s]/g, "");

        if (i <= 2) {

            fruits['header'][i] = thisValue;

        } else if (i >= 3) {
            // console.log(thisValue);
            fruits['data'][j] = thisValue;
            j++;
        }

    });

    // console.log(JSON.parse(JSON.stringify(fruits)));
    // console.log(fruits.data.length);

    return JSON.parse(JSON.stringify(fruits));
}

// send url
(async (url) => {
    // console.log(await getScript(url));
    // console.log(cheerio.load('div[id=DetailPlace_uc_goldprices1_GoldPricesUpdatePanel]').html(await getScript(url)))
    return console.log(chio(await getScript(url)));

})(uri);