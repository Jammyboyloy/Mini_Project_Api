let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
// Resgister
const form = document.querySelector("form");
let fname = document.querySelector("#fname");
let lname = document.querySelector("#lname");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let cpassword = document.querySelector("#cpassword");
let p = document.querySelectorAll("p");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  // p[0].innerHTML = fname.value === "" ? "First name is required" : "";
  // p[1].innerHTML = lname.value === "" ? "Last name is required" : "";
  // p[2].innerHTML = email.value === "" ? "Email is required" : "";
  // p[3].innerHTML = password.value === "" ? "Password is required" : "";
  // p[4].innerHTML = cpassword.value === "" ? "Confirm password is required" : "";
  // fname.value === "" ? fname.classList.add("rq") : fname.classList.remove("rq");
  // lname.value === "" ? lname.classList.add("rq") : lname.classList.remove("rq");
  // email.value === "" ? email.classList.add("rq") : email.classList.remove("rq");
  // password.value === ""
  //   ? password.classList.add("rq")
  //   : password.classList.remove("rq");
  // cpassword.value === ""
  //   ? cpassword.classList.add("rq")
  //   : cpassword.classList.remove("rq");

  fetch(baseUrl + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: fname.value,
      lastName: lname.value,
      email: email.value,
      password: password.value,
      confirmPassword: cpassword.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.result && data.details) {
        data.details.forEach((msg) => {
          if (msg.toLowerCase().includes("first name")) {
            p[0].innerHTML = msg;
            fname.classList.add("rq");
          } else if (msg.toLowerCase().includes("last name")) {
            p[1].innerHTML = msg;
            lname.classList.add("rq");
          } else if (msg.toLowerCase().includes("email")) {
            p[2].innerHTML = msg;
            email.classList.add("rq");
          } else if (
            msg.toLowerCase().includes("password") &&
            msg.toLowerCase().includes("confirm") === false
          ) {
            p[3].innerHTML = msg;
            password.classList.add("rq");
            cpassword.classList.add("rq");
          } else if (msg.toLowerCase().includes("confirm")) {
            p[4].innerHTML = msg;
            cpassword.classList.add("rq");
          } 
        });
      } else {
        // Success
        console.log("Registration successful:", data);
      }
      
      if(data.message.toLowerCase().includes("used")){
        p[2].innerHTML = data.message;
        email.classList.add("rq");
      } 

    });
});

fname.addEventListener("focus", () => {
  fname.classList.add("focused");
});

fname.addEventListener("blur", () => {
  fname.classList.remove("focused");
});

fname.addEventListener("input", () => {
  if (fname.value === "") {
    fname.classList.remove("rq");
    p[0].innerHTML = "";
  }
  if (fname.value !== "") {
    p[0].innerHTML = "";
    fname.classList.remove("rq");
  }
});

lname.addEventListener("focus", () => {
  lname.classList.add("focused");
});

lname.addEventListener("blur", () => {
  lname.classList.remove("focused");
});

lname.addEventListener("input", () => {
  if (lname.value === "") {
    lname.classList.remove("rq");
    p[1].innerHTML = "";
  }
  if (lname.value !== "") {
    p[1].innerHTML = "";
    lname.classList.remove("rq");
  }
});

email.addEventListener("focus", () => {
  email.classList.add("focused");
});

email.addEventListener("input", () => {
  if (email.value.includes("@gmail.com")) {
    p[2].innerHTML = "";
    email.classList.remove("rq");
  }
  if (email.value === "") {
    email.classList.remove("rq");
    p[2].innerHTML = "";
  }
});

email.addEventListener("blur", () => {
  p[2].innerHTML =
    email.value === ""
      ? (p[3].innerHTML = "")
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
    p[3].innerHTML = "";
  }
  if (password.value !== "") {
    p[3].innerHTML = "";
    password.classList.remove("rq");
  }
});

cpassword.addEventListener("focus", () => {
  cpassword.classList.add("focused");
});

cpassword.addEventListener("blur", () => {
  cpassword.classList.remove("focused");
});

cpassword.addEventListener("input", () => {
  if (cpassword.value === "") {
    cpassword.classList.remove("rq");
    p[4].innerHTML = "";
  }
  if (cpassword.value !== "") {
    p[4].innerHTML = "";
    cpassword.classList.remove("rq");
  }
});

document.querySelectorAll(".icon-eye").forEach((eye) => {
  eye.onclick = () => {
    const input = eye.parentElement.querySelector("input");

    input.type = input.type === "password" ? "text" : "password";

    eye.classList.toggle("bi-eye");
    eye.classList.toggle("bi-eye-slash");
  };
});
