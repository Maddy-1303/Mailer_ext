// background_script.js
console.log("Background script loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getCurrentURL') {
    const currentUrl = message.currentUrl;
    console.log("Received current URL:", currentUrl);

    // Wait for 10 seconds before checking the current tab's URL
    setTimeout(function () {
      console.log("Checking the current tab's URL");

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];

        if (currentTab.url === 'https://app.mailercheck.com/dashboard') {
          console.log("Current tab is on the dashboard, updating the URL");

          // Update the URL of the current tab
          chrome.tabs.update(currentTab.id, { url: 'https://hostinger.titan.email/mail/' }, function (updatedTab) {
            console.log("Tab updated:", updatedTab);

            // Wait for 5 seconds after updating the URL
            setTimeout(function () {
              console.log("Sending message to content script");
              chrome.tabs.sendMessage(updatedTab.id, { action: 'backgroundScriptMessage', data: 'Message from background script' });
            }, 5000); // 5 seconds delay
          });
        } else if (currentTab.url === 'https://app.mailercheck.com/register') {
          console.log("Current tab is not on the dashboard");
          chrome.tabs.sendMessage(currentTab.id, { action: 'RecaptchaMessage', data: 'Message from background script' });
        }

      });
    }, 7000); // 10 seconds delay
  }
});
