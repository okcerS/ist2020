const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const PATH = "html/";

const kategorije = ["Automobili", "Alati", "Nameštaj", "Ostalo", "Poducavanje", "Stanovi"];

let ID = 1;

let oglasi = [
    {
        "id": ID++,
        "kategorija": "Alati",
        "datumIstekaOglasa": "2021-02-28",
        "tekst":  "Stihl motorna testera u dobrom stanju, za više informacija poziv. Strugara Panj, Ranilović.",
        "oznaka": "Stihl motorna testera",
        "cena": "100",
        "valuta": "EUR",
        "email": "strugara@panj.rs"
    },
    {
        "id": ID++,
        "kategorija": "Automobili",
        "datumIstekaOglasa": "2021-01-30",
        "tekst":  "Prodajem auto VW Golf 6 u dobrom stanju, sve kao na slici. Kontakt pozivom nakon 12h.",
        "oznaka": "Volkswagen Golf 6",
        "cena": "5500",
        "valuta": "EUR",
        "email": "okcers97@gmail.com"
    },
    {
        "id": ID++,
        "kategorija": "Stanovi",
        "datumIstekaOglasa": "2020-09-25",
        "tekst":  "Prodajem namešten stan u Beogradu kod Fontane, 43m2, stara gradnja, pogodan za izdavanje studentima. Kontakt porukom ili pozivom.",
        "oznaka": "stan Novi Beograd prodaja",
        "cena": "75000",
        "valuta": "EUR",
        "email": "xxdoomslayerxx@yahoo.com"
    },
    {
        "id": ID++,
        "kategorija": "Nameštaj",
        "datumIstekaOglasa": "2020-10-03",
        "tekst":  "Radni sto dimenzija 140x75x60 bez ogrebotina",
        "oznaka": "radni sto",
        "cena": "11000",
        "valuta": "DIN",
        "email": "namestaj.rade@hotmail.com"
    },
    {
        "id": ID++,
        "kategorija": "Poducavanje",
        "datumIstekaOglasa": "2020-10-13",
        "tekst":  "Dajem časove engleskog jezika deci do 12 godina. Cena 2000din za dvočas (1h30min).",
        "oznaka": "časovi engleski",
        "cena": "2000",
        "valuta": "DIN",
        "email": "nauciengleskilako@gmail.com"
    }
];

http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    
    if (req.method == "GET"){
        if (urlObj.pathname == "/oglasi" || urlObj.pathname == "/"){ 
            fs.readFile(PATH + "oglasi.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/api/svi-oglasi"){ 
            res.writeHead(200);
            data = JSON.stringify(sviOglasi());
            res.end(data);
        }

        if(urlObj.pathname == '/api/kategorije') {
            res.writeHead(200);
            data = JSON.stringify(sveKategorije());
            res.end(data);
        }

        if (urlObj.pathname == "/izmeniOglas"){
            fs.readFile(PATH + "izmeniOglas.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/noviOglas"){
            fs.readFile(PATH + "noviOglas.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
    }


}).listen(5500);