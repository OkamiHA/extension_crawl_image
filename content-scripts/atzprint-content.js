async function atzprintCrawler() {
    var links = [];
    let validLinks = [].slice.apply(document.getElementsByTagName('a'));
    validLinks = validLinks.filter(function (element) {
        let flag = false
        let validClassAttribute = "ProductItemInner";
        if (element.getAttribute("class") && element.getAttribute("class").includes(validClassAttribute)) {
            flag = true
        }
        return flag
    }).map(function (element) {
        return "https://atzprint.com" + element.getAttribute("href");
    });
    for (const validLink of validLinks) {
        var response = await fetch(validLink);
        var html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        var scriptTags = [].slice.apply(doc.head.querySelectorAll('script[type="application/ld+json"]'));
        scriptTags = scriptTags.filter(function (element) {
            let page_flag = false;
            if (!element.getAttribute("class")) {
                page_flag = true;
            }
            return page_flag;
        }).map(function (element) {
            let dataScript = JSON.parse(element.text);
            if (dataScript.image) {
                let imageAlt = dataScript.name;
                imageAlt = imageAlt.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<")
                    .replace(/&quot;/g, "\"").replace(/&#39;/g, "\'").replace(/[\/:*?\"<>|]/g, "");
                return { "src": dataScript.image, "name": imageAlt + ".jpeg" };
            }
        });
        links.push(scriptTags[0]);
    }
    chrome.runtime.sendMessage(links);
}
atzprintCrawler();