const { shell } = require("electron");
console.log(shell);

const categorize_btn = document.getElementById("categorize-btn");
const remove_btn = document.getElementById("remove-btn");
const login_btn = document.getElementById("login-btn");
const how_many_input = document.getElementById("how_many_input");

const selections = document.querySelectorAll(".selection");

let loggedIn = false;

async function getAuthenticationURL() {
  const response = await fetch(
      `http://127.0.0.1:8000/get_authentication_url`,
      );

  return await response.json();
};

async function get_labels() {
    const response = await fetch(
      "http://127.0.0.1:8000/get_labels",
    );

  const data = await response.json();

  console.log(data);

  selections.forEach(select => {
    data.labels.forEach(label => {
      const option = document.createElement("option");

      option.value = label.id;        // Gmail Label-ID speichern
      option.textContent = label.name; // sichtbarer Text

      select.appendChild(option);
    });
  });
}

login_btn.addEventListener("click", openBrowser)
async function openBrowser() {
    try {
        const auth = await getAuthenticationURL();

        console.log(auth);

        await shell.openExternal(auth.url);
    } catch (err) {
        console.error("Login error:", err);
    }
}

module.exports = {
    openBrowser
};

get_labels();

categorize_btn.addEventListener("click", categorizePosts);
async function categorizePosts() {
  animate(how_many_input, {
    scale: [1.3, 1],
    duration: 400,
    ease: "outBack",
  });

  const labels = 
  {
    "Important": document.getElementById("Important").value,
    "Newsletter": document.getElementById("Newsletter").value,
    "Shopping": document.getElementById("Shopping").value,
    "Finance": document.getElementById("Finance").value,
    "Notifications": document.getElementById("Notifications").value,
    "Spam": document.getElementById("Spam").value
  }

  const response = await fetch(
    `http://127.0.0.1:8000/categorize?how_many=${parseInt(how_many_input.value)}&desired_labels=${encodeURIComponent(JSON.stringify(labels))}`,
  );

  const data = await response.json();
  console.log(data);
}

remove_btn.addEventListener("click", removeLabels);
async function removeLabels() {
  animate(how_many_input, {
    scale: [1.3, 1],
    duration: 400,
    ease: "outBack",
  });

  const response = await fetch(
    `http://127.0.0.1:8000/remove_labels?how_many=${parseInt(how_many_input.value)}`,
  );

  const data = await response.json();
  console.log(data);
}
