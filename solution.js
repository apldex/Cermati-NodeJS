const cheerio = require('cheerio');
const rp = require('request-promise');

const home_url = "https://m.bnizona.com/index.php/category/index/promo";
var result = {};
var halaman = 0;

async function main() {
  try{
    let html = await rp(home_url);
    let $ = cheerio.load(html);
    let data_home_page = $('div.arrow').toArray();
      for (var i = 0 ; i < data_home_page.length ; i++){
        let category = data_home_page[i].next.next.children[0].data;
        let category_url = data_home_page[i].next.next.attribs.href;
        // console.log(category);
        // console.log(i + category);
        // console.log(i + category_url);

        if (result[category]){
          result[category] = result[category];
        }
        else{
          result[category] = [];
        }
        await access_category_page(category_url,category);
      }
      // console.log(result);
  

  } catch (err){
    return console.log("ERROR DI main");
  }
}

async function access_category_page(url,category){
  // console.log("access category page parameter = "+ category);
  try{
    let html = await rp(url);
    let $ = cheerio.load(html);
    if ($('#loadmoreajaxloader').attr('href')){
      let promo_url = $('#loadmoreajaxloader').attr('href')+"/"+halaman;
      // console.log(promo_url);
      access_promo_first_page(promo_url,category);
    }
  } catch (err){
    return console.log("ERORR DI category");
  }
  
}

async function access_promo_first_page(url,category){
  // console.log("access promo page parameter = "+ category);

  try{
    let html = await rp(url);
    let $ = cheerio.load(html);

    $('li > a').each(function(i, element){
      let imageurl = $(this).children().attr('src');
      let merchant = this.children[1].children[0].data;
      let title = this.children[2].children[0].data;
      let valid = this.children[3].children[0].data;


      var metadata = {
        'imageurl' : imageurl,
        'merchant' : merchant,
        'title' : title,
        'valid' : valid
      };
      result[category].push(metadata);

    });
    
    
  } catch (err){
    return console.log("ERROR DI promo_first_page\n\n" + err);
  }
}

main()
    .then(() => {
        console.log('FINISHED');
        console.log(result);
    })
    .catch((e) => {
        console.log(e);
    });