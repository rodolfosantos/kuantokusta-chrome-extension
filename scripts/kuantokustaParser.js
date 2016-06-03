var TAIL_TITLE_START = "- Comparador de pre";

function KuantoKustaParser(productUrl) {
    this.productUrl = productUrl;
    this.productTitle = null;
}

function KuantoKustaParser(productUrl, productTitle) {
    this.productUrl = productUrl;
    this.productTitle = productTitle;
}

KuantoKustaParser.prototype.isValidUrl = function () {
    if (new RegExp("^.+?\\d{1,6}$").test(this.productUrl)) { //ends with 6 numbers
        return true;
    }
    return false;
}

KuantoKustaParser.prototype.getMinPriceOfItem = function () {
    var doc = doGet(this.productUrl);
    var prices = parseKuantoKustaPrices(doc);
    return minValue(prices);
}

KuantoKustaParser.prototype.getTitle = function () {
    if(this.productTitle == null)
        return "";
    
    var parsedTitle = this.productTitle;
    parsedTitle = parsedTitle.split(TAIL_TITLE_START)[0].trim();
    return parsedTitle;
}

KuantoKustaParser.prototype.getUrl = function () {
    return this.productUrl;
}

// ==================================================================

function loadHTMLString(txt) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(txt, "text/html");
    return xmlDoc;
}

/* returns a DOM object like document*/
function doGet(url) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    //console.log(xmlHttp.responseText);
    return loadHTMLString(xmlHttp.responseText)
}

function parseKuantoKustaPrices(document) {
    var result = new Array();
    var productPrices = $(document).find(".price")

    for (i in productPrices) {
        var priceVal = productPrices[i].innerHTML;
        if (priceVal == undefined)
            continue;

        var priceValue = priceVal.replace(/\u20ac/g, '').replace(/,/, '.');
        var price = parseFloat(priceValue);

        result.push(price);
    }

    return result;
}

function minValue(priceList) {
    return Math.min.apply(Math, priceList);
}