import {renderHomePage, useFetchedData,renderLoginForm} from "./main.js"
import { fetchData, showError, graphql_url, Authentication_url , Encrypt} from "./utils.js";

export function login(event) {
    event.preventDefault(); // Prevent form from submitting the default way
    const email = document.getElementById('email').value;
    const password = document.getElementById('mdp').value;
    const errorMessages = document.getElementById('error_messages');
    errorMessages.innerHTML = ''; // Clear previous error messages

    let hasError = false;

    if (!hasError) {
        // Generate base64 encoded credentials
        
        // const credentials = btoa(`${email}:${password}`);

        fetchData(Encrypt(`${email}:${password}`)).then(data => {
            if (data) {
                localStorage.setItem('authToken', data); // Save the token in localStorage
                document.body.innerHTML = ""
                renderHomePage();
            } else {
                showError("Login or Password Incorrect")
            }
        });
    }
}

export function logout() {
    localStorage.removeItem("authToken");
    console.log("Logged out");
    console.log(localStorage);
    const homePage = document.getElementById("Home_Page");
    if (homePage) {
      document.body.removeChild(homePage);
    }
    renderLoginForm();
  }