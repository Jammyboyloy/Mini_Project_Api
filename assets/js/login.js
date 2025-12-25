let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
// Log in
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");
const p = document.querySelectorAll("p");
const formControl = document.querySelector(".form-control");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  p[0].innerHTML = email.value === "" ? "Email is required" : "";
  p[1].innerHTML = password.value === "" ? "Password is required" : "";
  email.value === "" ? email.classList.add("rq") : email.classList.remove("rq");
  password.value === ""
    ? password.classList.add("rq")
    : password.classList.remove("rq");
  fetch(baseUrl + "/auth/login", {
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

email.addEventListener("focus", () => {
  email.classList.add("focused");
});

email.addEventListener("input", () => {
  if (email.value.includes("@gmail.com")) {
    p[0].innerHTML = "";
    email.classList.remove("rq");
  }
  if (email.value === "") {
    email.classList.remove("rq");
    p[0].innerHTML = "";
  }
});

email.addEventListener("blur", () => {
  p[0].innerHTML =
    email.value === ""
      ? (p[0].innerHTML = "")
      : email.value.includes("@gmail.com")
      ? ""
      : "Please enter a valid email address";
  email.value === ""
    ? email.classList.remove("focused")
    : email.value.includes("@gmail.com")
    ? (email.classList.remove("rq"), email.classList.remove("focused"))
    : email.classList.add("rq");
});

password.addEventListener("focus", () => {
  password.classList.add("focused");
});

password.addEventListener("blur", () => {
  password.classList.remove("focused");
});

password.addEventListener("input", () => {
  if (password.value === "") {
    password.classList.remove("rq");
    p[1].innerHTML = "";
  }
  if (password.value !== "") {
    p[1].innerHTML = "";
    password.classList.remove("rq");
  }
});

const iconEye = document.querySelector(".icon-eye");
iconEye.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
  iconEye.classList.toggle("bi-eye");
  iconEye.classList.toggle("bi-eye-slash");
});
