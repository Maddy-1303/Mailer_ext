// popup.js
document.addEventListener('DOMContentLoaded', function () {
    const listForm = document.getElementById('listForm');
    const errorMessageContainer = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitButton');

    // Initially hide the error message
    errorMessageContainer.style.display = 'none';

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];

        // Show the form regardless of the current URL

        // Hide the submit button initially
        submitBtn.style.display = 'none';

        listForm.addEventListener('input', function () {
            const email = document.getElementById('email').value.trim();

            // Show the submit button only if both email and password are not empty
            const password = document.getElementById('password').value.trim();
            if (email && isPasswordValid(password)) {
                submitBtn.style.display = 'block';
            } else {
                submitBtn.style.display = 'none';
            }
        });

        listForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Submit the form
            submitForm(email, password);
        });
    });

    function isPasswordValid(password) {
        // Password must have one lowercase character, one number, one uppercase character, and be at least 8 characters long
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /\d/;

        return lowercaseRegex.test(password) && uppercaseRegex.test(password) && numberRegex.test(password) && password.length >= 8;
    }

    // Function to submit the form
    function submitForm(email, password) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];

            // Update the current tab's URL to the MailerCheck URL
            chrome.tabs.update(tab.id, { url: 'https://app.mailercheck.com/register' }, function (updatedTab) {
                // Add a listener for tab updates
                chrome.tabs.onUpdated.addListener(function onTabUpdated(tabId, changeInfo, tab) {
                    if (tabId === updatedTab.id && changeInfo.status === 'complete') {
                        // Remove the listener to avoid multiple executions
                        chrome.tabs.onUpdated.removeListener(onTabUpdated);

                        // Wait for 10 seconds before checking the URL
                        setTimeout(function () {
                            // Get the current URL
                            chrome.tabs.query({ active: true, currentWindow: true }, function (currentTabs) {
                                const currentTab = currentTabs[0];
                                const currentUrl = currentTab.url;

                                // Check if the current URL is the target URL
                                if (currentUrl === 'https://app.mailercheck.com/register') {
                                    // Send the message to the content script
                                    chrome.tabs.sendMessage(updatedTab.id, { action: 'executeContentScript', email, password });

                                    // Close the popup window
                                    window.close();
                                }
                            });
                        }, 5000); // 10 seconds in milliseconds
                    }
                });
            });
        });
    }
});
