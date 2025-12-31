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
      if (data.result === true) {
        localStorage.setItem("token", data.data.token);
        location.href = "Article/dashboard.html";
      }
      if(data.email !== email.value && data.password !== password.value && email.value !== "" && password.value !== ""){
        showToast("Invalid email or password.");
      }
    });
});

email.addEventListener("focus", () => {
  email.classList.add("focused");
});

email.addEventListener("input", () => {
  if (email.value.includes("@gmail.com") || email.value === "") {
    p[0].innerHTML = "";
    email.classList.remove("rq");
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
    password.classList.remove("rq");
    p[1].innerHTML = "";
});

const iconEye = document.querySelector(".icon-eye");
iconEye.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
  iconEye.classList.toggle("bi-eye");
  iconEye.classList.toggle("bi-eye-slash");
});

function showToast(msg) {
  const toast = document.querySelector(".my-toast");
  toast.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);
}
