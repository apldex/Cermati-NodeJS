// Created by Azhar Kurnia <azharkurnia19@gmail.com>
// Last Modified: Monday, 09 April 2018 - 0:26 AM
// Solution for Cermati Back-End Internship's programming test.

"use strict";

const cheerio = require("cheerio");
const rp = require("request-promise");
var fs = require("fs");

const home_url = "https://m.bnizona.com/index.php/category/index/promo";
var result = {};

async function main() {
  try{
    let html = await rp(home_url);
    let $ = cheerio.load(html);
    let data_home_page = $("div.arrow").toArray();
      for (var i = 0 ; i < data_home_page.length ; i++){
        let category = data_home_page[i].next.next.children[0].data.toLowerCase();
        let category_url = data_home_page[i].next.next.attribs.href;
      
        if (result[category]){
          result[category] = result[category];
        }
        else{
          result[category] = [];
        }
        await access_category_page(category_url,category);
      }
      return result;  

  } catch (err){
    return console.log("ERROR DI main");
  }
}

async function access_category_page(url,category){
  try{
    let halaman = 0;
    let html = await rp(url);
    let $ = cheerio.load(html);
    if ($("#loadmoreajaxloader").attr("href")){
      let promo_url = $("#loadmoreajaxloader").attr("href")+"/";
      access_promo(promo_url,category,halaman);
    }
  } catch (err){
    return console.log(err);
  }
}

async function access_promo(url,category,page){
  try{
    let html = await rp(url+page);
    let $ = cheerio.load(html);

    $("li > a").each(function(i, element){
      let imageurl = $(this).children().attr("src");
      let merchant = this.children[1].children[0].data;
      let title = this.children[2].children[0].data;
      let valid = this.children[3].children[0].data;

      var metadata = {
        "imageurl" : imageurl,
        "merchant" : merchant,
        "title" : title,
        "valid" : valid.slice(12)
      };
      result[category].push(metadata);
    });
    
    if (await rp(url+(page+10))){
      access_promo(url,category,page+10);
    }
    
  } catch (err){
    return console.log("ERROR DI promo_first_page\n" + err);
  }
}

main()
    .then((data) => {
        const json = JSON.stringify(data);
        const filename = "solution.json"
        fs.writeFileSync(filename,json);
        console.log("File " + filename + " created.");
        
    })
    .catch((e) => {
        console.log(e);
    });