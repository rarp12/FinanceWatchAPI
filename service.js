const url = require('url');
var querystring = require('querystring');
var https = require('https');
var host = "api.iextrading.com";
const fs = require('fs');
var headers = {
    'Content-Type': 'application/json'
};
var options = {
    host: host,
    headers: headers
};


exports.symbolInfoRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var unknowSymbol=false;
    var method = req.method;
    var responseString = {};
    options.method = method;
    options.path = '/1.0/stock/' + reqUrl.query.symbol + '/quote';
    
    //Quote request
    var httpReqLatestPrice = https.request(options, function (httpRes) {
        httpRes.setEncoding('utf-8');

        httpRes.on('data', function (data) {
            console.log('first', data);
            try {
                dataObject = JSON.parse(data);
                responseString.latestPrice = dataObject.latestPrice;
            } catch (error) {
                unknowSymbol=true;
            }

        });
        httpRes.on('end', function () {
            httpReqLogo.end();
        });
    });

    //Logo Request
    options.path = '/1.0/stock/' + reqUrl.query.symbol + '/logo';
    var httpReqLogo = https.request(options, function (httpRes) {
        httpRes.setEncoding('utf-8');

        httpRes.on('data', function (data) {
            try {
                dataObject = JSON.parse(data);
                responseString.companyLogo = dataObject.url;
            } catch (error) {
                unknowSymbol=true;
            }

        });
        httpRes.on('end', function () {
            httpReqArticle.end();
        });
    });

    //News Request
    options.path = '/1.0/stock/' + reqUrl.query.symbol + '/news/last/1';
    var httpReqArticle = https.request(options, function (httpRes) {
        httpRes.setEncoding('utf-8');
        httpRes.on('data', function (data) {
            try {
                dataObject = JSON.parse((data));
                responseString.articleUrl = dataObject[0].url;
            } catch (error) {
                unknowSymbol=true;
            }

        });
        httpRes.on('end', function () {
            if(unknowSymbol==true){
                res.statusCode = 204;
                writeLogs(reqUrl,204);
                res.end();
            }else{
                res.statusCode = 200;
                writeLogs(reqUrl,200);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(responseString));
            }
            
        });
    });

    httpReqLatestPrice.end();

};

function writeLogs(reqUrl,status){
    var d = new Date;
    var dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');

    var log="Path: "+reqUrl.path+", Request time: "+dformat+", Response status:"+status+"\n";
    
    fs.appendFile("Log.txt", log, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved.");
    });
}

