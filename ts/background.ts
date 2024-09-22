const filterURLs = [ 
  "chrome://extensions/",
  "chrome-extension://" + chrome.runtime.id,
  "chrome-extension://" + chrome.runtime.id + "/html/map.html",
  "https://maps.googleapis.com/maps/api/js/QuotaService.RecordEvent",
  'https://api.ipify.org?format=json',
  'https://dns.google.com/resolve?name=',
  "https://api.ip2location.io/"
];

const initiatorURL = "chrome-extension://" + chrome.runtime.id;

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(info: chrome.webRequest.WebRequestHeadersDetails) {
    // don't log calls from our tab
    const queryInfo: chrome.tabs.QueryInfo = { "active": true };
    chrome.tabs.query(queryInfo, function(tabs: chrome.tabs.Tab[]) {
      if ((filterURLs.includes(info.url) || info.initiator === initiatorURL)) {
        // do nothing
      } else {
        addURL(info);
      }
    });  
  },
  // filters
  {
    urls: ["<all_urls>"]
  }
);

function addURL(info: chrome.webRequest.WebRequestHeadersDetails): void {
  const urlInfo: { [key: string]: string } = {};
  // save the hostname to local storage
  if (!info.url) {
    return; 
  }
  const parsedURL = parseURL(info.url);
  const hostname = parsedURL?.hostname;
  if (hostname) {
    urlInfo[info.requestId] = hostname;
    chrome.storage.local.set(urlInfo, function () {
      // empty callback
    });
  }
}

// https://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
function parseURL(url: string) {
  try {
    return new URL(url);
  } catch (e) {
    return null;
  }
}
