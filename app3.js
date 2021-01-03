const fs = require('fs');
var cars = require("./cars");
var num = 0;
var val = "27672291680@c.us";
var dummy = 0;

//let writejson = fs.createWriteStream("cars.json", { flags: 'a' });

var parseJson;
/*for (var i in cars.users) {
    if (cars.users[i].number === val ) {
        cars["users"].order = "1";
        console.log(cars.users[i].order);
        num = 1;
        dummy = i;
    }
}
if (num === 1) {
    console.log(dummy);
}*/
 
fs.readFile('cars.json', function (err, content) {
    if (err) throw err;
    var parseJson = JSON.parse(content);
    for (var i in parseJson.users) {
        console.log(parseJson.users[i]);
        if (parseJson.users[i].number === "value") {
            if (parseJson.users[i].order === "0") {
                dummy = 1;
                parseJson.users[i].order = "1";
            }
        }
    }
    if (dummy === 0) {
        parseJson.users.push({ number: "value2", order: "0" });
    }
    //writejson.write(JSON.stringify(parseJson));
    fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
        if (err) throw err;
        console.log("done");
    });
})


