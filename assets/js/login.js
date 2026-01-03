// Log in
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");
const p = document.querySelectorAll("p");
const formControl = document.querySelector(".form-control");

form.addEventListener("submit", (event) => {
  email.classList.remove("focused");
  password.classList.remove("focused");
  event.preventDefault();
  p[0].innerHTML = email.value === "" ? "Email is required" : "";
  p[1].innerHTML = password.value === "" ? "Password is required" : "";
  email.value === "" ? email.classList.add("rq") : email.classList.remove("rq");
  password.value === ""
    ? password.classList.add("rq")
    : password.classList.remove("rq");

  if (!email.value.includes("@gmail.com")) {
    email.classList.add("rq");
    p[0].innerHTML = "Please enter a valid email address";
  }

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
        sessionStorage.setItem("isLogin", "true");
        location.href = "Article/dashboard.html";
      }

      if (email.value !== "" && password.value !== "" && email.value.includes("@gmail.com"))
        showToast("Invalid email or password.");
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
 
  if(email.value === ""){
    p[0].innerHTML = "";
    email.classList.remove("rq");
    email.classList.remove("focused");
  }else if(email.value !== "" && !email.value.includes("@gmail.com")){
    p[0].innerHTML = "Please enter a valid email address";
    email.classList.add("rq");
  }
  
});

password.addEventListener("focus", () => {
  password.classList.add("focused");
});

password.addEventListener("blur", () => {
  if(password.value === ""){
    password.classList.remove("rq");
    password.classList.remove("focused");
    p[1].innerHTML = "";
  }
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
  const toastError = document.querySelector(".my-toast-error");
  toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toastError.classList.add("show");

  setTimeout(() => toastError.classList.remove("show"), 4000);

  const toastSuccess = document.querySelector(".my-toast-success");
  let isRegister = sessionStorage.getItem("isRegister");
  let toastMsg = sessionStorage.getItem("toastMsg");
  if (isRegister) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${toastMsg}`;
    toastSuccess.classList.add("show");
    sessionStorage.removeItem("isRegister");
    sessionStorage.removeItem("toastMsg");
  }

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isRegister")) {
    showToast("");
  }
});
