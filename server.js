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
    else if(req.method == "POST") {
        if (urlObj.pathname == "/izmeni-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                izmeniOglas(parseInt(querystring.parse(body).id),querystring.parse(body).kategorija, querystring.parse(body).datumIstekaOglasa, querystring.parse(body).tekst, querystring.parse(body).oznaka, querystring.parse(body).cena, querystring.parse(body).email, querystring.parse(body).valuta)
                res.writeHead(302, {
                    'Location': '/izmeniOglas'
                });
                res.end()
            });
        }

        if (urlObj.pathname == "/pripremi-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.writeHead(200);
                data = nadjiOglas(parseInt(querystring.parse(body).id));
                data['kategorije'] = sveKategorije();
                res.end(JSON.stringify(data))
            });
        }

        if (urlObj.pathname == "/api/filtriranje"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.writeHead(200);
                res.end(JSON.stringify(filtrirajOglase(querystring.parse(body).tekst)))
            });
        }

        if (urlObj.pathname == "/obrisi-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                obrisiOglas(parseInt(querystring.parse(body).id));
                res.writeHead(302, {
                    'Location': '/oglasi'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/novi-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                noviOglas(querystring.parse(body).kategorija,
                           querystring.parse(body).datumIstekaOglasa,querystring.parse(body).tekst, querystring.parse(body).oznaka, querystring.parse(body).cena, querystring.parse(body).email, querystring.parse(body).valuta);

                res.writeHead(200);
                res.end(JSON.stringify('/oglasi'));
            });
        }
    }

}).listen(5500);

function sviOglasi(){
    return oglasi;
}

function sveKategorije() {
    return kategorije;
}

function nadjiOglas(id) {
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id === id){
            return oglasi[i];
        }
    }
}

function filtrirajOglase(tekst) {
    let pomocni = []
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].tekst.toLowerCase().includes(tekst.trim().toLowerCase()) || oglasi[i].kategorija.toLowerCase().includes(tekst.trim().toLowerCase()) || oglasi[i].oznaka.toLowerCase().includes(tekst.trim().toLowerCase()) ){
            pomocni.push(oglasi[i])
        }
    }

    return pomocni;
}

function izmeniOglas(id, kategorija, datumIstekaOglasa, tekst, oznaka, cena, email, valuta){
   
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id == id){
            oglasi[i].kategorija = kategorija;
            oglasi[i].datumIstekaOglasa = datumIstekaOglasa;
            oglasi[i].tekst = tekst;
            oglasi[i].oznaka = oznaka;
            oglasi[i].cena = cena;
            oglasi[i].valuta = valuta;
            oglasi[i].email = email;
        }
    }

}
function obrisiOglas(id){
    let pomocni = []
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id != id){
            pomocni.push(oglasi[i])
        }
    }
    oglasi = pomocni;
    return oglasi;
}
function noviOglas(kategorija, datumIstekaOglasa, tekst, oznaka, cena, email, valuta){
    let oglas =   {
        "id": ID++,
        "kategorija": kategorija,
        "datumIstekaOglasa": datumIstekaOglasa,
        "tekst":  tekst,
        "oznaka": oznaka,
        "cena": cena,
        "valuta": valuta,
        "email": email
    };

    oglasi.push(oglas);
}