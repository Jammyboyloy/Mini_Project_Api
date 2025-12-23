// Log in
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");
const p = document.querySelector("p");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetch("http://blogs.csm.linkpc.net/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      data.result == false
        ? (p.innerText = data.message)
        : (localStorage.setItem("token", data.data.token),
          (location.href = "Article/dashboard.html"));
    });
});
