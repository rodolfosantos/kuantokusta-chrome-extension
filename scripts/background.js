var PREFS = "prefs";


function loadPrefs() {
    //localStorage.clear();
    var prefs = localStorage.getItem(PREFS);
    if (prefs == null)
        localStorage.setItem(PREFS, JSON.stringify({
            items: []
        }));

    return JSON.parse(localStorage.getItem(PREFS));
}

function savePrefs(object) {
    localStorage.setItem(PREFS, JSON.stringify(object));
}

function loadProdsInPrefs() {
    prefs = {
        items: [{
                title: "Apple iPhone 6s 16GB",
                url: "http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Telemoveis-Desbloqueados/Apple-iPhone-6s-16GB-Space-Grey-Desbloqueado-p-2-193447",
                price: 1000
        },
                {
                title: "LG G3 32gb",
                url: "http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Telemoveis-Desbloqueados/LG-G3-D855-16GB-Metallic-Black-Desbloqueado-p-2-146553",
                price: 500
        },
            {
                title: "Moto 360",
                url: "http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Smartwatch/Motorola-Moto-360-Dark-Chrome-Black-Leather-p-2-166834",
                price: 499
        }]
    }
    savePrefs(prefs);
}

function checkProdsInPrefs() {
    console.log("Checking...");
    var prefs = loadPrefs();
    var items = prefs.items;

    for (var i = 0; i < items.length; i++) {
        var elem = items.shift();
        var title = elem.title;
        var url = elem.url;
        var price = elem.price;

        var actualPrice = new KuantoKustaParser(url).getMinPriceOfItem();
        if (actualPrice != price || price == -1) {
            var newProductPrice = {
                title: title,
                url: url,
                price: actualPrice
            };
            items.push(newProductPrice);
            notifyNewPrice(newProductPrice, price);
        } else {
            items.push({
                title: title,
                url: url,
                price: price
            });
        }
    }

    savePrefs(prefs);
}


function notifyNewPrice(elem, oldprice) {
    
    var before = "";
    
    if(oldprice != -1){
        before = " (before: " + oldprice + "\u20ac)";
    }

    var opt = {
        type: "basic",
        title: "KuantoKusta price alert",
        message: elem.title +" have a new price: " + elem.price + "\u20ac" + before,
        iconUrl: "../img/extension_icon.png"
    }
    
    chrome.notifications.create(elem.title, opt);
}


function testItems() {
    min = new KuantoKustaParser("http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Telemoveis-Desbloqueados/LG-G3-D855-16GB-Metallic-Black-Desbloqueado-p-2-146553").getMinPriceOfItem();
    console.log(min);

    min = new KuantoKustaParser("http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Smartwatch/Motorola-Moto-360-Dark-Chrome-Black-Leather-p-2-166834").getMinPriceOfItem();
    console.log(min);

    min = new KuantoKustaParser("http://www.kuantokusta.pt/comunicacoes/Telemoveis-Smartphones/Telemoveis-Desbloqueados/Samsung-Galaxy-S6-32GB-SM-G920F-Black-Sapphire-Desbloqueado-p-2-176917").getMinPriceOfItem();
    console.log(min);
}


testItems();
loadProdsInPrefs();

checkProdsInPrefs();
setInterval(function () {
    checkProdsInPrefs();
}, 3600);



//.........................................................