/* ================= ELEMENTS ================= */
let inputForm = document.getElementById("inputForm");
let title = document.getElementById("Title");
let category = document.getElementById("Category");
let thumbnail = document.getElementById("Thumbnail");
let errorTitle = document.getElementById("errorTitle");
let Description = document.getElementById("Description");
let errorCategory = document.getElementById("errorCategory");
let errorThumbnail = document.getElementById("errorThumbnail");
let errorDescription = document.getElementById("errorDescription");

/* ================= QUILL TOOLBAR ================= */
let toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image"],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ["clean"],
];
/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  quill = new Quill("#Description", {
    theme: "snow",
    placeholder: "Write article description...",
    modules: {
      toolbar: toolbarOptions,
    },
  });

  loadCategories();
});

/* ================= GET CATEGORIES ================= */
function loadCategories() {
  fetch(`${baseUrl}/categories?_page=1&_per_page=100&sortBy=name&sortDir=ASC`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      category.innerHTML =
        '<option value="" disabled selected >-- Select Category --</option>';
      let categories = res.data?.items || res.data || res.categories || [];
      categories.forEach((cat) => {
        let option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        category.appendChild(option);
      });
    })
    .catch((err) => console.error("Category error:", err));
}
loadCategories();

/* ================= THUMBNAIL PREVIEW ================= */
thumbnail.addEventListener("change", (e) => {
  let file = e.target.files[0];
  if (!file) return;

  if (!validateThumbnail(file)) {
    thumbnail.value = "";
    errorThumbnail.textContent =
      "Invalid thumbnail. Please select a JPG or PNG image under 1MB.";
    return;
  } else {
    errorThumbnail.textContent = "";
  }
});
function validateThumbnail(file) {
  let allowed = ["image/jpeg", "image/png"];
  let maxSize = 1024 * 1024;

  if (!allowed.includes(file.type)) {
    errorThumbnail.textContent = "Only JPG or PNG images allowed";
    return false;
  }
  if (file.size > maxSize) {
    errorThumbnail.textContent = "Image must be under 2MB";
    return false;
  }
  return true;
}

/* ================= INPUT FOCUS EFFECT ================= */
title.addEventListener("focus", function () {
  title.classList.add("focused");
});
title.addEventListener("blur", function () {
  title.classList.remove("focused");
});

category.addEventListener("focus", function () {
  category.classList.add("focused");
});
category.addEventListener("blur", function () {
  category.classList.remove("focused");
});

thumbnail.addEventListener("focus", function () {
  thumbnail.classList.add("focused");
});
thumbnail.addEventListener("blur", function () {
  thumbnail.classList.remove("focused");
});
Description.addEventListener("focus", () => {
  Description.classList.add("focused");
});
Description.addEventListener("blur", () => {
  Description.classList.remove("focused");
});

/* ================= FORM VALIDATION ================= */
function validateForm() {
  errorTitle.textContent = title.value === "" ? "Title is required" : "";
  errorCategory.textContent =
    category.value === "" ? "Category is required" : "";
  errorThumbnail.textContent =
    thumbnail.value === "" ? "Thumbnail is required" : "";
  errorDescription.textContent =
    quill.getText().trim() === "" ? "Description is required" : "";

  if (title.value === "") {
    title.classList.add("rq");
  }
  if (category.value === "") {
    category.classList.add("rq");
  }
  if (thumbnail.value === "") {
    thumbnail.classList.add("rq");
  }
  if (quill.getText().trim() === "") {
    Description.classList.add("rq");
  }
  if (
    title.value === "" ||
    category.value === "" ||
    quill.getText().trim() === ""
  ) {
    return false;
  }
  return true;
}

// Remove error messages 
title.addEventListener("keyup", () => {
  if (title.value.trim() !== "") {
    title.classList.remove("rq");
    errorTitle.textContent = "";
  }
});
category.addEventListener("change", () => {
  if (category.value !== "") {
    category.classList.remove("rq");
    errorCategory.textContent = "";
  }
});
thumbnail.addEventListener("change", () => {
  if (thumbnail.value !== "") {
    thumbnail.classList.remove("rq");
    errorThumbnail.textContent = "";
  }
});
Description.addEventListener("keyup", () => {
  if (quill.getText().trim() !== "") {
    Description.classList.remove("rq");
    errorDescription.textContent = "";
  }
});
/* ================= SUBMIT FORM ================= */
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }
  fetch(`${baseUrl}/articles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title.value,
      content: quill.root.innerHTML,
      categoryId: Number(category.value),
    }),
  })
    .then((res) => res.json())
    .then((article) => {
      if (article.result === false) {
        showToastError("Error creating article. Please try again.");
        return;
      }
      /* UPLOAD THUMBNAIL */
      const formData = new FormData();
      formData.append("thumbnail", thumbnail.files[0]);

      return fetch(`${baseUrl}/articles/${article.data.id}/thumbnail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.result === true){
        location.href = "../Article/allArticle.html";
        sessionStorage.setItem("isCreated","true");
      }
    });
  // .catch((err) => {
  //   console.error(err);
  //   showToast("Error creating article. Please try again.");
  // });
});

/* ================= TOAST NOTIFICATION ================= */
function showToastError(msg) {
  const toastError = document.querySelector(".my-toast-error");
  toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toastError.classList.add("show");
  setTimeout(() => toastError.classList.remove("show"), 4000);
}

function showToastSuccess(msg) {
  const toastSuccess = document.querySelector(".my-toast-success");
  toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
  toastSuccess.classList.add("show");
  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}
