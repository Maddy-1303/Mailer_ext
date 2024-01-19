// content_script.js
console.log("Content script executed");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message in content script:", message);

  if (message.action === 'executeContentScript') {
    const email = message.email;
    const password = message.password;

    // Call the function to fill in the form fields
    fillForm(email, password);

    // Call the function to submit the form
    submitForm();

    // Wait for 10 seconds before checking the URL
  } else if (message.action === 'backgroundScriptMessage') {
    console.log("I am content:", message.data);
    openmail();
    // Handle the message as needed
  } else if (message.action === 'RecaptchaMessage') {
    console.log("I am content:", message.data);
    alert("Error: You are on the register page. You need Recaptcha verification");
  }
});

// Function to fill in the form fields
function fillForm(email, password) {
  // Extract the username from the email
  const username = extractUsername(email);

  // Fill in the email, password, and name fields in the HTML form
  document.getElementById('name').value = username;
  document.getElementById('account_name').value = "Magic";
  document.getElementById('email').value = email;
  document.getElementById('password').value = password;
  document.getElementById('terms').checked = true;
  document.getElementById('subscribe').checked = true;
  console.log('Filled in Name:', username);
  console.log('Filled in Email:', email);
  console.log('Filled in Password:', password);
}

// Function to extract the username from the email
function extractUsername(email) {
  // Assuming the email is in the format "username@example.com"
  const username = email.split('@')[0];
  return username;
}

// Function to submit the form
function submitForm() {
  document.querySelector('button[data-sitekey="6Lc6dskhAAAAALbDONIi4pFw1ozU3hZ3mf4-Aoj-"]').click();
  const currentUrl = window.location.href;
  console.log('Current URL after form submission:', currentUrl);

  chrome.runtime.sendMessage({ action: 'getCurrentURL', currentUrl });
}

function openmail() {
  setTimeout(function () {
    console.log("Inside the function");

    const firstMailItem = document.querySelector('.list-tabular-item');

    if (firstMailItem) {
      console.log("Found the first mail item");

      const participantsDiv = firstMailItem.querySelector('.participants');

      if (participantsDiv) {
        console.log("Clicked on participants");

        participantsDiv.click();

        setTimeout(() => {
          const iframe = document.querySelector('.iframe-container iframe');

          if (iframe) {
            console.log("Found the iframe");

            const iframeDocument = iframe.contentDocument;
            const verifyEmailButton = iframeDocument.querySelector('.mlContentButton');

            if (verifyEmailButton) {
              console.log("Found the verify email button");

              const hrefAttribute = verifyEmailButton.querySelector('a').getAttribute('href');
              window.location.href = hrefAttribute;

            } else {
              console.error("Could not find the verify email button");
            }
          } else {
            console.error("Could not find the iframe");
          }
        }, 2000);

      } else {
        console.error("Could not find the participants div");
      }
    } else {
      console.error("Could not find the first mail item");
    }

    console.log("Outside the function");

  }, 7000);
}
