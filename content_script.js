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
    // Trigger a click on the submit button
    document.querySelector('button[data-sitekey="6Lc6dskhAAAAALbDONIi4pFw1ozU3hZ3mf4-Aoj-"]').click();
 
    
}



