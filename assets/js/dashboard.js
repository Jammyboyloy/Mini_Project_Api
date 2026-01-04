let loadMore = document.querySelector("#loadMore");
if (!token) location.href = "../index.html";
let page = 1;

function showDashboard() {
  fetch(
    baseUrl +
      `/articles?_page=${page}&_per_page=12&sortBy=createdAt&sortDir=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      let rows = "";

      res.data.items.forEach((item) => {
        const plainText = quillToPlainText(item.content);
        // const preview = previewText(plainText, 20);
        rows += `
             <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card shadow-sm rounded-2 bg-main flex-fill d-flex flex-column h-100 py-2">
                    <button class="btn pb-0 border-0" onclick="detail(${item.id})">
                      <div class="card-header p-0 bg-main border-0 d-flex align-items-center gap-2">
                           <img src="${item.creator.avatar}"
                                alt="" class="img-fluid object-fit-cover rounded-circle"
                                style="width: 40px; height: 40px;">
                           <div class="d-flex flex-column gap-1 align-items-start">
                                <h6 class="p-0 m-0 fs-7 text-main ellipsis name text-nowrap">${
                                  item.creator.firstName
                                } ${item.creator.lastName}</h6>
                                <h6 class="p-0 m-0 fs-7 text-secondary fst-italic text-nowrap">
                                    ${formatDate(item.createdAt)}
                                </h6>
                           </div>
                           <small
                                class="fs-7 bg-primary w-fit h-fit rounded-4 px-3 text-primary ms-auto"
                                style="padding: 2px;">${previewText(
                                  item.category?.name ?? "null",
                                  4
                                )}</small>
                      </div>
                      <div class="card-body px-0 pb-0 text-start">
                           <div class="card-img mb-3 w-100" style="height: 150px;">
                                <img src="${item.thumbnail}"
                                     alt="" class="img-fluid rounded-2 object-fit-cover w-100 h-100">
                           </div>
                           <h6 class="ellipsis text-main fw-bold">${item.title}</h6>
                           <p class="ellipsis text-secondary fs-6 mt-1">${plainText}</p>
                      </div>
                    </button>
                </div>
            </div>
          `;
      });

      let dashboardContainer = document.querySelector(".dashboard-container");
      dashboardContainer.innerHTML += rows;
      loadMore.style.display = res.data.meta.hasNextPage ? "block" : "none";
    });
}

showDashboard();

function detail(id) {
  sessionStorage.setItem("idArticle", id);
  location.href = "detail.html";
}

loadMore.addEventListener("click", () => {
  page++;
  showDashboard();
});

function quillToPlainText(content) {
  if (!content) {
    return "";
  } else if (
    typeof content === "string" &&
    !content.startsWith("<") &&
    !content.startsWith("{")
  ) {
    // Plain text
    return content.trim();
  } else if (typeof content === "string" && content.startsWith("<")) {
    // HTML
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.innerText.trim();
  } else {
    // Delta JSON (fallback)
    try {
      const delta = typeof content === "string" ? JSON.parse(content) : content;
      const temp = new Quill(document.createElement("div"));
      temp.setContents(delta);
      return temp.getText().trim();
    } catch {
      return content.toString().trim();
    }
  }
}

function previewText(text, limit = 20) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function showToast(msg) {

  const toastSuccess = document.querySelector(".my-toast-success");
  let isLogin = sessionStorage.getItem("isLogin");
  if (isLogin) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
    setTimeout(() => toastSuccess.classList.add("show"), 800);
    sessionStorage.removeItem("isLogin");
  }

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLogin")) {
    showToast("You’re logged in successfully."); 
  }
});


