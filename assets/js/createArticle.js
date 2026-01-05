if (!token) location.href = "../index.html";
/* ================= ELEMENTS ================= */
let inputForm = document.getElementById("inputForm");
let title = document.getElementById("Title");
let category = document.getElementById("Category");
let thumbnail = document.getElementById("Thumbnail");
let quillWrapper = document.getElementById("quill-wrapper");
let errorTitle = document.getElementById("errorTitle");
let Description = document.getElementById("Description");
let errorCategory = document.getElementById("errorCategory");
let errorThumbnail = document.getElementById("errorThumbnail");
let errorDescription = document.getElementById("errorDescription");
let isSubmitting = false;

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
    modules: { toolbar: toolbarOptions },
  });
  loadCategories();
  initValidation();
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
    errorThumbnail.textContent = "Image must be under 1MB";
    return false;
  }
  return true;
}

function setError(el, errorEl, message) {
  if (message) {
    el.classList.add("rq");
    errorEl.textContent = message;
  } else {
    el.classList.remove("rq");
    errorEl.textContent = "";
  }
}

function initValidation() {
  title.addEventListener("input", () => {
    setError(title, errorTitle, title.value.trim() ? "" : "Title is required");
  });

  category.addEventListener("change", () => {
    setError(
      category,
      errorCategory,
      category.value ? "" : "Category is required"
    );
  });

  thumbnail.addEventListener("change", () => {
    const file = thumbnail.files[0];

    if (!file) {
      setError(thumbnail, errorThumbnail, "Thumbnail is required");
      return;
    }

    if (!validateThumbnail(file)) {
      thumbnail.value = "";
      return;
    }

    setError(thumbnail, errorThumbnail, "");
  });

  quill.on("text-change", () => {
    const isEmpty = quill.getText().trim() === "";
    setError(
      quillWrapper,
      errorDescription,
      isEmpty ? "Description is required" : ""
    );
  });

  quillWrapper.addEventListener("focusin", () => {
    quillWrapper.classList.add("focused");
    quillWrapper.classList.remove("rq");
    errorDescription.textContent = "";
  });

  quillWrapper.addEventListener("focusout", () => {
    quillWrapper.classList.remove("focused");
    if (quill.getText().trim() === "") {
      quillWrapper.classList.add("rq");
      errorDescription.textContent = "Description is required";
    }
  });
}
/* ================= FORM VALIDATION ================= */
function validateForm() {
  const titleValid = title.value.trim() !== "";
  const categoryValid = category.value !== "";
  const descValid = quill.getText().trim() !== "";
  const thumbValid = thumbnail.files.length > 0;

  setError(title, errorTitle, titleValid ? "" : "Title is required");
  setError(
    category,
    errorCategory,
    categoryValid ? "" : "Category is required"
  );
  setError(
    quillWrapper,
    errorDescription,
    descValid ? "" : "Description is required"
  );
  setError(
    thumbnail,
    errorThumbnail,
    thumbValid ? "" : "Thumbnail is required"
  );

  return titleValid && categoryValid && descValid && thumbValid;
}

/* ================= INPUT FOCUS EFFECT ================= */
title.addEventListener("focus", function () {
  title.classList.add("focused");
});
title.addEventListener("blur", function () {
  title.classList.remove("focused");
  if (title.value === "") {
    title.classList.add("rq");
    errorTitle.textContent = "Title is required";
  }
});
category.addEventListener("focus", function () {
  category.classList.add("focused");
});
category.addEventListener("blur", function () {
  if (category.value === "") {
    category.classList.add("rq");
    errorCategory.textContent = "Category is required";
  } else {
    category.classList.remove("focused");
  }
});

thumbnail.addEventListener("focus", function () {
  thumbnail.classList.add("focused");
});
thumbnail.addEventListener("blur", function () {
    thumbnail.classList.remove("focused");
});

quillWrapper.addEventListener("focus-within", () => {
  quillWrapper.classList.add("focused");
});
quillWrapper.addEventListener("blur", () => {
  if (quill.getText().trim() === "") {
    quillWrapper.classList.remove("focused");
    quillWrapper.classList.add("rq");
    errorDescription.textContent = "Description is required";
  } else {
    quillWrapper.classList.remove("focused");
  }
});
/* ================= SUBMIT FORM ================= */
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  isSubmitting = true;
  if (!validateForm()) {
    isSubmitting = false;
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
      if (res.result === true) {
        location.href = "../Article/allArticle.html";
        sessionStorage.setItem("isCreated", "true");
      }
    });
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
