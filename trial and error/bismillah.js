const cheerio = require('cheerio');
const request = require('request');

//var bluebird = require('bluebird');

const home_url = "https://m.bnizona.com/index.php/category/index/promo";
var result = {};
var halaman = 0;
request(home_url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var parsedResults = [];

    $('div.arrow').each(function(i, element){
        var a = $(this).next();
        console.log(a);
      var category = a.text();
      result[category] = [];
      var category_url = a.attr('href');
      request(category_url, function (error, response, html){
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var main_url = $('#loadmoreajaxloader').attr('href')+"/"+halaman;
          request(main_url, function (error, response, html){
            var $ = cheerio.load(html);
            $('li').each(function(i, element){
              var a = $(this).children();
              var imgurl = a.next().attr('src');
              var merchant = a.next().next().text();
              var title = a.next().next().next().text();
              var valid = a.next().next().next().next().text();

              var metadata = {
                imageurl : imgurl,
                merchant : merchant,
                title : title,
                valid : valid
              };
              result[category].push(metadata)
            });

          });
        }
      });
      
      // Select the previous element
    





      // var a = $(this).prev();
      // // Get the rank by parsing the element two levels above the "a" element
      // var rank = a.parent().parent().text();
      // // Parse the link title
      // var title = a.text();
      // // Parse the href attribute from the "a" element
      // var url = a.attr('href');
      // // Get the subtext children from the next row in the HTML table.
      // var subtext = a.parent().parent().next().children('.subtext').children();
      // // Extract the relevant data from the children
      // var points = $(subtext).eq(0).text();
      // var username = $(subtext).eq(1).text();
      // var comments = $(subtext).eq(2).text();
      // // Our parsed meta data object
      // var metadata = {
      //   rank: parseInt(rank),
      //   title: title,
      //   url: url,
      //   points: parseInt(points),
      //   username: username,
      //   comments: parseInt(comments)
      // };
      // // Push meta-data into parsedResults array
      // parsedResults.push(metadata);
    });
    // Log our finished parse results in the terminal
    console.log(result);
  }
});