var myFeed;
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)){
            return false;
          }
    }
    return true;
}

function onGot(item) {
  if (isEmpty(item)) {
    myFeed=[]
  } else {
    console.log(`got ${item}`)
    myFeed = item.myFeed
  }
  console.log(myFeed);
}

function onError(error) {
  console.log(`Error: ${error}`)
}

let gettingItem = browser.storage.local.get('myFeed');
gettingItem.then(onGot, onError);

function askForRestart(){
  console.log("restarting");
  browser.runtime.sendMessage("restart");
}

function serveMaster(request, sender, response){

  console.log(request);
  restarting = setTimeout(askForRestart, request.timeoutDelay);

  // var s = new XMLSerializer();
  // var doc = s.serializeToString(document);

  var link = getLinks(document);

    browser.runtime.sendMessage("log", link);
    window.location=link

}

function saveUrls(url) {
  console.log("about to push")
  myFeed.push(url)
  browser.storage.local.set({
    myFeed: myFeed
  })
}

function validDomain(url){
  var regmatch = new Array(
    /[.]com/i,/[.]org/i,/[.]net/i,/[.]edu/i,/[.]gov/i,/[.]mil/i,/[.]boston/i,/[.]miami/i,/[.]nyc/i,/[.]quebec/i,/[.]vegas/i,);
  for(regex of regmatch){
    if(regex.test(url)){
      console.log("proper domain found " + url);

      return true;
    };

  };

  console.log("Improper domain found");
  return false;
}

function validUrl(url){
  console.log(url);
  var regskip = new Array(
  /calendar/i,/advanced/i,/click/i,/Groups/i,/Images/,/Maps/i,/search/i,/cache/i
    ,/similar/i,/&#169;/,/signup/i,/download/i,/print/i,/Books/i,/rss/i
    ,/xRank/,/permalink/i,/aggregator/i,/trackback/i,/comment/i,/More/
    ,/business solutions/i,/register/i,/result/i,/view/i,/Legal/,/See all/,/links/i,/submit/i
    ,/Sites/i,/ click/i,/Blogs/,/feedback/i,/sponsored/i,/preferences/i
    ,/privacy/i,/News/,/Finance/,/Reader/,/Documents/,/windows live/i,/tell us/i
    ,/shopping/i,/Photos/,/Video/,/Scholar/,/AOL/,/advertis/i,/Webmasters/,/MapQuest/
    ,/Movies/,/Music/,/Yellow Pages/,/jobs/i,/answers/i,/options/i,/customize/i,/settings/i
    ,/Developers/,/cashback/,/Health/,/Products/,/<more>/,/Travel/,/Personals/
    ,/Local/,/Trademarks/,/cache/i,/similar/i,/login/i,/signin/i,/mail/i,/feed/i,/pay/i
    ,/accounts/i,/[.]tar$/,/[.]exe$/,/[.]zip$/,/[.]pdf$/,/[.]wav$/,/[.]txt$/,/[.]js$/
    ,/[.]jse$/,/[.]msi$/,/[.]bat$/,/[.]reg$/,/[.]doc$/,/[.]xls$/,/[.]ppt$/,/[.]gz$/,/[.]tgz$/);


  for(regex of regskip){
    if(regex.test(url)){
        console.log(regex + ". skipping " + url);

        return false;
      };
      //one more test with testing for url in loop
      if( !validDomain(url)){
        return false;
      }
    };
  return true;

}

function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;

  do {

    randomIndex = Math.floor(Math.random()*urls.length);
    url = urls.slice(randomIndex, randomIndex+1)[0];

  } while(!validUrl(url) && urls.length > 0);


  if(urls.length == 0){
      console.log("asking for restart");

      askForRestart();
  }
  //debugger;

  saveUrls(url);
  return url;

}

console.log("going");

browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
