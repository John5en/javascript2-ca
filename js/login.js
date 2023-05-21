const form = document.querySelector(".login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// event listener for form event
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const credentials = {
    email: username,
    password,
  };

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/social/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful!");
      console.log("Response:", data);

      const accessToken = data.accessToken;
      console.log("Access token:", accessToken);
      localStorage.setItem("accessToken", accessToken);

      const message = document.createElement("p");
      message.textContent = "Login successful!";
      message.style.color = "green";
      form.appendChild(message);
    } else {
      console.error("Failed to login. Error:", response.statusText);

      const message = document.createElement("p");
      message.textContent = "Login failed. Please check your credentials.";
      message.style.color = "red";
      form.appendChild(message);
    }
  } catch (error) {
    console.error("An error occurred while logging in:", error);
  }
});
