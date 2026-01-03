const perPage = 10;
let currentPage = 1;
let tbody = document.querySelector("#tbody");
let showPage = document.querySelector("#showingPage");
let pagination = document.querySelector("#pagination");
let searchInput = document.querySelector("#searchCategory");
let btnDelete = document.querySelector("#deleteCategory");
let btnEdit = document.querySelector("#editCategory");
let showNameDelete = document.querySelector("#showNamedelete");
function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function loadCategories(page = 1, search = "") {
  currentPage = page;
  fetch(
    `${baseUrl}/categories?_page=${page}&_per_page=${perPage}&sortBy=createdAt&sortDir=DESC&search=${search}`
  )
    .then((res) => res.json())
    .then((res) => {
      const item = res.data.items;
      const meta = res.data.meta;
      let row = "";
      if (item.length === 0) {
        setSearchError(true);
        row = `
          <tr>
            <td colspan="2" class="text-center pb-4">
               <!-- Lottie Animation -->
              <dotlottie-wc src="../assets/image/Error 404.json" style="height: 350px" loop autoplay speed="1"
                mode="forward">
              </dotlottie-wc>
              <h5 class="text-secondary">No categories found</h5>
            </td>
          </tr>
        `;
      } else {
        setSearchError(false);
        item.forEach((data) => {
          let categoryName = data.name;
          if (search.trim() !== "") {
            const searchTerm = escapeRegex(search.trim());
            const regex = new RegExp(`(${searchTerm})`, "gi"); // global + case-insensitive
            categoryName = categoryName.replace(
              regex,
              '<span class="text-danger fw-semibold">$1</span>'
            );
          }

          row += `
            <tr class="align-middle">
              <td class="py-3 ps-4 fw-medium">${categoryName}</td>
              <td class="py-3 pe-4 text-end">
                <button
                  class="btn btn-sm nav-text me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#categoryEdit"
                  onclick="openEditModal('${data.id}', '${data.name}')">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm nav-text"
                  onclick="openDeleteModal('${data.id}','${data.name}')"
                  data-bs-toggle="modal"
                  data-bs-target="#categoryDelete">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          `;
        });
      }

      tbody.innerHTML = row;
      const startItem = (meta.currentPage - 1) * meta.itemPerPage + 1;
      const endItem = Math.min(
        meta.currentPage * meta.itemPerPage,
        meta.totalItems
      );
      showPage.innerText =
        meta.totalItems === 0
          ? "Showing 0 entries"
          : `Showing ${startItem} to ${endItem} of ${meta.totalItems} entries`;

      createPagination(meta);
    });
}

// link new page
function createPagination(meta) {
  const total = meta.totalPages;
  const current = meta.currentPage;
  let html = "";

  // Previous
  html += `
    <li class="page-item ${!meta.hasPreviousPage ? "disabled" : ""}">
      <a class="page-link" href="#"
         onclick="event.preventDefault(); loadCategories(${current - 1}, '${
    searchInput.value
  }')">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `;

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push("...");
  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  if (total > 1) pages.push(total);

  pages.forEach((p) => {
    if (p === "...") {
      html += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    } else {
      html += `
        <li class="page-item ${p === current ? "active" : ""}">
          <a class="page-link"
             href="#"
             onclick="event.preventDefault(); loadCategories(${p}, '${
        searchInput.value
      }')">
            ${p}
          </a>
        </li>
      `;
    }
  });

  // Next
  html += `
    <li class="page-item ${!meta.hasNextPage ? "disabled" : ""}">
      <a class="page-link" href="#"
         onclick="event.preventDefault(); loadCategories(${current + 1}, '${
    searchInput.value
  }')">
        <i class="bi bi-chevron-right "></i>
      </a>
    </li>
  `;

  pagination.innerHTML = html;
}

// search category
function setSearchError(isError) {
  if (isError) {
    searchInput.classList.add("rq");
  } else {
    searchInput.classList.remove("rq");
  }
}
searchInput.addEventListener("input", () => {
  setSearchError(false);
  loadCategories(1, searchInput.value);
});

searchInput.addEventListener("focus", () => {
  searchInput.classList.add("focused");
});

searchInput.addEventListener("blur", () => {
  searchInput.classList.remove("focused");
});

// create category
document.getElementById("createNewCategory").onclick = () => {
  const name = document.getElementById("createNewCategoryName").value.trim();
  if (!name) {
    showError("Category name cannot be empty");
    return;
  }

  fetch(`${baseUrl}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: name }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.result) {
        showError("Failed to create category");
        return;
      }
      showSuccess("Category created successfully!");
      bootstrap.Modal.getInstance(
        document.getElementById("createCategory")
      ).hide();

      document.getElementById("createNewCategoryName").value = "";

      loadCategories(currentPage, searchInput.value);
    })
    .catch((err) => {
      console.error(err);
      showError("Something went wrong. Please try again.");
    });
};
document
  .getElementById("createNewCategoryName")
  .addEventListener("focus", () => {
    document.getElementById("createNewCategoryName").classList.add("focused");
  });
document
  .getElementById("createNewCategoryName")
  .addEventListener("blur", () => {
    document
      .getElementById("createNewCategoryName")
      .classList.remove("focused");
  });

// delete
let deleteID = null;
let deleteName = null;
function openDeleteModal(id, name) {
  deleteID = id;
  deleteName = name;
  document.getElementById("showNamedelete").textContent = `"${name}"`;
}
btnDelete.onclick = () => {
  if (!deleteID) {
    showError("Category not found.");
  }

  fetch(`${baseUrl}/categories/${deleteID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("categoryDelete")
      ).hide();
      showSuccess(`Removed category "${deleteName}" successful.`);
      loadCategories(currentPage, searchInput.value);
      deleteID = null;
      deleteName = null;
    });
};

//edit catefory
let editID = null;
function openEditModal(id, name) {
  editID = id;
  document.querySelector("#editCategoryName").value = name;
}
btnEdit.onclick = () => {
  const newName = document.querySelector("#editCategoryName").value.trim();
  if (!newName) {
    showError("Category not found.");
    return;
  }
  fetch(`${baseUrl}/categories/${editID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: newName,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.result) {
        showError("Internal server error");
        return;
      }
      showSuccess("Updated category successful");
      bootstrap.Modal.getInstance(
        document.getElementById("categoryEdit")
      ).hide();
      loadCategories(currentPage, searchInput.value);
      editID = null;
    });
};
document.querySelector("#editCategoryName").addEventListener("focus", () => {
  document.querySelector("#editCategoryName").classList.add("focused");
});
document.querySelector("#editCategoryName").addEventListener("blur", () => {
  document.querySelector("#editCategoryName").remove("focused");
});

// show toast
function showError(msg) {
  const toastError = document.querySelector(".my-toast-error");
  toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toastError.classList.add("show");

  setTimeout(() => toastError.classList.remove("show"), 4000);
}

function showSuccess(msg) {
  const toastSuccess = document.querySelector(".my-toast-success");
  toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
  toastSuccess.classList.add("show");

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

loadCategories();
