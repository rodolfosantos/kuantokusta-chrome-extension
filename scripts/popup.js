currentUrl = "";
currentTitle = "";

$(document).ready(function() {
    $('body').on('click', 'a', function() {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $('#subBtn').attr("disabled", true);
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        currentUrl = tabs[0].url;
        currentTitle = tabs[0].title;

        console.log(currentTitle);
        console.log(new KuantoKustaParser(currentUrl, currentTitle).getTitle());

        if (isUrlRelevant(new KuantoKustaParser(currentUrl, currentTitle))) { //ends with 6 numbers
            $('#subBtn').attr("disabled", false);
        }

    });

    $('#subBtn').click(function() {
        var prefs = chrome.extension.getBackgroundPage().loadPrefs();
        var items = prefs.items;

        var parser = new KuantoKustaParser(currentUrl, currentTitle);

        items.push({
            title: parser.getTitle(),
            url: parser.getUrl(),
            price: parser.getMinPriceOfItem()
        });

        chrome.extension.getBackgroundPage().savePrefs(prefs);
        chrome.extension.getBackgroundPage().checkProdsInPrefs();
        window.close();
    });


});

$(document).ready(function() {
    var console = chrome.extension.getBackgroundPage().console
    console.log("ready!");

    var prefs = chrome.extension.getBackgroundPage().loadPrefs();
    var items = prefs.items;

    for (i in items) {
        var title = items[i].title;
        var url = items[i].url;
        var price = items[i].price;

        // <a href="#" class="list-group-item">Pictures <span class="badge">25&euro;</span></a>


        var itemId = 'item' + i;
        var element = $('<a href="' + url + '" class="list-group-item"><span class="glyphicon glyphicon-remove-circle ' + itemId + '"></span> ' + title + '<span class="badge">' + price + '&euro;</span></a>');

        $('#itemlist').append(element);

        $('.' + itemId).click(function(item) {

            var id = 0;
            $('.list-group-item').each(function(index, value) {
                if (value == item.target.parentElement) {
                    item.target.parentElement.remove();

                    var dbItems = chrome.extension.getBackgroundPage().loadPrefs();
                    dbItems.items.splice(id, 1);
                    chrome.extension.getBackgroundPage().savePrefs(dbItems);

                }
                id++;
            });

        });

    }

});


function isUrlRelevant(parser) {
    if (!parser.isValidUrl())
        return false;

    //check is item was already added
    var prefs = chrome.extension.getBackgroundPage().loadPrefs();
    var items = prefs.items;

    for (i in items) {
        if (parser.getUrl() == items[i].url)
            return false;
    }

    return true;
}