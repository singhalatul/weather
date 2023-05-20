const http = require ("http");
const fs = require ("fs");
var requests = require('requests');

const homeFile =  fs.readFileSync("home.html" , "utf-8");
const replaceVal = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
 temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
 temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
 temperature = temperature.replace("{%location%}", orgval.name);
 temperature = temperature.replace("{%country%}", orgval.sys.country);
 temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);

 return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url=='/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=b812047d44311110e4ade875aca0f543")
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            if(arrData[0].main.temp){
                arrData[0].main.temp = Number((arrData[0].main.temp-273).toFixed(2));
            }
            if(arrData[0].main.feels_like){
                arrData[0].main.feels_like = Number((arrData[0].main.feels_like-273).toFixed(2));
            }
            if(arrData[0].main.temp_min){
                arrData[0].main.temp_min = Number((arrData[0].main.temp_min-273).toFixed(2));
            }
            if(arrData[0].main.temp_max){
                arrData[0].main.temp_max = Number((arrData[0].main.temp_max-273).toFixed(2));
            }
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile, val)) //==> isme .map function use kiya usme val pass krne se array ki saari saktiya aagayi
            .join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
})

server.listen(5000);