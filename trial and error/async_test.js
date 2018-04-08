"use strict";

const rp = require('request-promise');
const cheerio = require('cheerio');

async function main() {
    try{
        let html = await rp.get("https://m.bnizona.com/promo/loadmore/16/40");
        if(!html){
            console.log("SABI");
        }else {
            console.log("SABIIIIIIIIIII");
        }
        
            
            return html;
    } catch (err){
        return null;
    }
}

main()
    .then((data) => {
        console.log(data)
        console.log("Finish");
    })
    .catch((e) => {
        console.log(e);
    });