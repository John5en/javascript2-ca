const form = document.getElementById("registrationForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const successMessage = document.getElementById("successMessage");

// add event listener to form submit event
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // create user profile object
  const profile = {
    name: username,
    email,
    password,
  };

  // make the API call to register the user
  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/social/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("User registered successfully!");
      console.log("Response:", data);

      const accessToken = data.accessToken;
      console.log("Access token:", accessToken);
      localStorage.setItem("accessToken", accessToken);

      successMessage.innerText = "User registered successfully!";
      successMessage.style.display = "block";

      await makeApiRequest("posts", "POST", profile);
    } else {
      console.error("Failed to register user. Error:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred while registering user:", error);
  }
});

async function makeApiRequest(endpoint, method, body) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `https://api.noroff.dev/api/v1/social/${endpoint}`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      console.log("API response:", data);
    } else {
      console.error("API request failed. Error:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred while making the API request:", error);
  }
}
