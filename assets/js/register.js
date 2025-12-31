// Resgister
const form = document.querySelector("form");
let fname = document.querySelector("#fname");
let lname = document.querySelector("#lname");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let cpassword = document.querySelector("#cpassword");
let p = document.querySelectorAll("p");
const inputs = [fname, lname, email, password, cpassword];
const check = [fname, lname];
const messages = [
  "First name is required",
  "Last name is required",
  "Email is required",
  "Password is required",
  "Confirm password is required",
];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;
  inputs.forEach((input, index) => {
    if (/^\d/.test(input.value)) {
      p[index].innerHTML = "Cannot start with a number";
      input.classList.add("rq");
      isValid = false;
    }

    if (input.value === "") {
      p[index].innerHTML = messages[index];
      input.classList.add("rq");
      isValid = false;
    }
  });

  if (!isValid) return;

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
      if (!data.result) {
        if (Array.isArray(data.details)) {
          data.details.forEach((msg) => {
            const m = msg.toLowerCase();

            if (m.includes("first name")) {
              fname.classList.add("rq");
              p[0].innerHTML = msg;
            } else if (m.includes("last name")) {
              lname.classList.add("rq");
              p[1].innerHTML = msg;
            } else if (m.includes("email") && !m.includes("used")) {
              email.classList.add("rq");
              p[2].innerHTML = msg;
            } else if (m.includes("password") && !m.includes("confirm")) {
              password.classList.add("rq");
              cpassword.classList.add("rq");
              p[3].innerHTML = msg;
            } else if (m.includes("confirm")) {
              cpassword.classList.add("rq");
              p[4].innerHTML = msg;
            }
          });
        }
        // email already used
        if (data.message.toLowerCase().includes("used")) {
          email.classList.add("rq");
          p[2].innerHTML = data.message;
        }
      } else {
        console.log("Registration successful:", data);
      }
    });
});

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.classList.add("focused");
  });
});

check.forEach((input, index) => {
  input.addEventListener("blur", () => {
    if (/^\d/.test(input.value)) {
      p[index].innerHTML = "Cannot start with a number";
      input.classList.add("rq");
    }
    input.classList.remove("focused");
  });

  input.addEventListener("input", () => {
    if (input.value === "") {
      input.classList.remove("rq");
      p[index].innerHTML = "";
    }
  });
});

email.addEventListener("input", () => {
  if (email.value.includes("@gmail.com") || email.value === "") {
    p[2].innerHTML = "";
    email.classList.remove("rq");
  }
});

email.addEventListener("blur", () => {
  p[2].innerHTML =
    email.value === ""
      ? ""
      : /^\d/.test(email.value)
      ? "Cannot start with a number"
      : email.value.includes("@gmail.com")
      ? ""
      : "Please enter a valid email address";

  email.value === ""
    ? email.classList.remove("focused")
    : email.value.includes("@gmail.com")
    ? (email.classList.remove("rq"), email.classList.remove("focused"))
    : email.classList.add("rq");
});

let prevPassword = password.value;

password.addEventListener("input", () => {
  if (
    password.value === "" ||
    /^(?!\d).*\d.*/.test(password.value) ||
    /[@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value) ||
    /[A-Z]/.test(password.value) ||
    password.value.length >= 6
  ) {
    p[3].innerHTML = "";
    password.classList.remove("rq");
  }

  if (cpassword.value !== "" && password.value !== prevPassword) {
    cpassword.value = "";
    cpassword.classList.remove("rq", "focused");
    p[4].innerHTML = "";
  }

  prevPassword = password.value; 
});

password.addEventListener("blur", () => {
  if (password.value === "") {
    p[3].innerHTML = "";
    password.classList.remove("rq");
  } else if (/^\d/.test(password.value)) {
    p[3].innerHTML = "Cannot start with a number";
    password.classList.add("rq");
  } else if (
    !/[A-Z]/.test(password.value) &&
    !/\d/.test(password.value) &&
    !/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value)
  ) {
    p[3].innerHTML =
      "Password must contain at least one uppercase letter, one number, and one special character.";
    password.classList.add("rq");
  } else if (
    !/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value) &&
    !/[A-Z]/.test(password.value)
  ) {
    p[3].innerHTML =
      "Password must contain at least one uppercase letter, and one special character.";
    password.classList.add("rq");
  } else if (
    !/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value) &&
    !/\d/.test(password.value)
  ) {
    p[3].innerHTML =
      "Password must contain at least one number, and one special character.";
    password.classList.add("rq");
  } else if (!/[A-Z]/.test(password.value) && !/\d/.test(password.value)) {
    p[3].innerHTML =
      "Password must contain at least one uppercase letter, and one number.";
    password.classList.add("rq");
  } else if (!/[A-Z]/.test(password.value)) {
    p[3].innerHTML = "Password must contain at least one uppercase letter.";
    password.classList.add("rq");
  } else if (!/\d/.test(password.value)) {
    p[3].innerHTML = "Password must contain at least one number.";
    password.classList.add("rq");
  } else if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value)) {
    p[3].innerHTML = "Password must contain at least one special character.";
    password.classList.add("rq");
  } else if (password.value.length < 6) {
    p[3].innerHTML = "Password must be at least 6 characters long.";
    password.classList.add("rq");
  }
  password.classList.remove("focused");
});

cpassword.addEventListener("blur", () => {
  if (cpassword.value !== password.value) {
    p[3].innerHTML = "Passwords do not match";
    p[4].innerHTML = "Passwords do not match";
    password.classList.add("rq");
    cpassword.classList.add("rq");
  } else {
    p[3].innerHTML = "";
    p[4].innerHTML = "";
    password.classList.remove("rq");
    cpassword.classList.remove("rq");
  }

  if (cpassword.value === "") {
    p[3].innerHTML = "";
    p[4].innerHTML = "";
    password.classList.remove("rq");
    cpassword.classList.remove("rq");
  }
  cpassword.classList.remove("focused");
});

cpassword.addEventListener("focus", () => {
  const passwordValid =
    /^(?!\d).*\d.*/.test(password.value) &&
    /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password.value) &&
    /[A-Z]/.test(password.value) &&
    password.value.length >= 6;

  if (!passwordValid) {
    password.focus();
    password.classList.add("rq");
    p[3].innerHTML = "Please complete your password first";
    return;
  }

  cpassword.classList.add("focused");
});

cpassword.addEventListener("input", () => {
  if (password.value === cpassword.value) {
    p[3].innerHTML = "";
    p[4].innerHTML = "";
    password.classList.remove("rq");
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
