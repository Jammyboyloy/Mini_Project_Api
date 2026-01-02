const perPage = 5;
let currentPage = 1;
let tbody = document.querySelector("#tbody");
let showPage = document.querySelector("#showingPage");
let pagination = document.querySelector("#pagination");
let searchInput = document.querySelector("#searchCategory"); 
// darkmode & light


function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function loadCategories(page = 1, search = "") {
  currentPage = page;
  fetch(
    `${baseUrl}/categories?_page=${page}&_per_page=${perPage}&sortBy=name&sortDir=ASC&search=${search}`
  )
    .then((res) => res.json())
    .then((res) => {
      const item = res.data.items;
      const meta = res.data.meta;
      let row = "";

      if (item.length === 0) {
        row = `
          <tr>
            <td colspan="2" class="text-center py-5">
              <img src="../assets/image/notFoundCategory.png" alt="No results found" style="width:400px; margin-bottom:10px;">
              <div class="text-secondary">No categories found</div>
            </td>
          </tr>
        `;
      } else {
        item.forEach((data) => {
          let categoryName = data.name;

          if (search.trim() !== "") {
            const searchTerm = escapeRegex(search.trim());
            const regex = new RegExp(`(${searchTerm})`, "gi"); // global + case-insensitive
            categoryName = categoryName.replace(
              regex,
              '<span style="color: red; font-weight: bold;">$1</span>'
            );
          }

          row += `
            <tr class="align-middle">
              <td class="py-3 ps-4">${categoryName}</td>
              <td class="py-3 pe-4 text-end">
                <button class="btn btn-sm nav-text me-1" data-bs-toggle="modal"
                  data-bs-target="#categoryEdit">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm nav-text"  data-bs-toggle="modal"
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
      const endItem = Math.min(meta.currentPage * meta.itemPerPage, meta.totalItems);
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
  const htmlArray = [];
  htmlArray.push(`
    <li class="${!meta.hasPreviousPage ? "disabled" : ""}">
      <a class="page-link page-pill" href="#" aria-label="Previous"
         onclick="event.preventDefault(); loadCategories(${current - 1}, '${
    searchInput.value
  }')">
        <i class="bi bi-arrow-left-circle"></i>
      </a>
    </li>
  `);

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
      htmlArray.push(`
        <li class="page-item disabled">
          <span class="page-link page-pill">…</span>
        </li>
      `);
    } else {
      htmlArray.push(`
        <li class="page-item ${p === current ? "active" : ""}">
          <a class="page-link page-pill ${p === current ? "active-pill" : ""}" 
             href="#" onclick="event.preventDefault(); loadCategories(${p}, '${
        searchInput.value
      }')">
            ${p}
          </a>
        </li>
      `);
    }
  });

  htmlArray.push(`
    <li class="${!meta.hasNextPage ? "disabled" : ""}">
      <a class="page-link page-pill" href="#" aria-label="Next"
         onclick="event.preventDefault(); loadCategories(${current + 1}, '${
    searchInput.value
  }')">
        <i class="bi bi-arrow-right-circle"></i>
      </a>
    </li>
  `);

  pagination.innerHTML = htmlArray.join("");
}

// search category
searchInput.addEventListener("input", () => {
  loadCategories(1, searchInput.value);
});

searchInput.addEventListener("focus", () => {
  searchInput.classList.add("focused");
});

searchInput.addEventListener("blur", () => {
  searchInput.classList.remove("focused");
});

// delete

document.querySelector("#deleteCategory").onclick = () =>{
 deleteCategory(id)
}

function deleteCategory (id){
 fetch(`${baseUrl}/categories/${id}`,{
  method : "DELETE",
  headers :{
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  }
 })
 .then(res => res.json())
 .then(res =>{
   console.log(res.data.id);
   
 })
 
}






loadCategories();