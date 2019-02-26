const http = require('http');
const url = require('url');
const fs = require('fs');
module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint
    if (reqUrl.pathname == '/symbol' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.symbolInfoRequest(req, res);
    }else{
        writeLogs(reqUrl,404)
    }
    
});

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
        console.log("The file was saved!");
    });
}