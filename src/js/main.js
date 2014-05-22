var active = false;

chrome.browserAction.onClicked.addListener(function() {
  chrome.browserAction.setIcon({path: 'img/icon.png'});
  chrome.tabs.query({active: true}, function(tabs) {
    if (tabs.length === 1) {
        // Notify active page about onClick event
        chrome.tabs.sendMessage(tabs[0].id, {cmd : 'browserAction:clicked'});
    }
  });
});

