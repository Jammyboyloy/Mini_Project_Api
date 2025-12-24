let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");

if (!token) location.href = "../index.html";

// Get Profile
fetch(baseUrl + "/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((item) => {
    document.querySelector(".user").innerHTML = `
          <h6 class="p-0 m-0 text-end text-main">${item.data.firstName} ${item.data.lastName}</h6>
          <small class="nav-text">${item.data.email}</small>`;

    document.querySelector(".userProfile").innerHTML = `
          <img src="${item.data.avatar}"alt="no" class="img-fluid rounded-circle object-fit-cover" style="width: 40px; height: 40px">`;
  });

fetch(
  baseUrl + "/articles?_page=1&_per_page=12&sortBy=createdAt&sortDir=desc",
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
      rows += `
         <div class="col-md-4">
            <div class="card shadow-sm rounded-2 bg-main">
                <button class="btn pb-0" onclick="detail(${item.id})">
                  <div class="card-header p-0 bg-main border-0 d-flex align-items-center gap-2">
                       <img src="${item.creator.avatar}"
                            alt="" class="img-fluid object-fit-cover rounded-circle"
                            style="width: 40px; height: 40px;">
                       <div class="d-flex flex-column gap-1 align-items-start">
                            <h6 class="p-0 m-0 fs-7 text-main ellipsis name text-nowrap">${item.creator.firstName} ${item.creator.lastName}</h6>
                            <h6 class="p-0 m-0 fs-7 text-secondary fst-italic text-nowrap">Dec 23, 2025
                            </h6>
                       </div>
                       <small
                            class="fs-7 bg-primary w-fit h-fit rounded-4 px-3 text-primary ms-auto ellipsis-cate text-nowrap"
                            style="padding: 2px;">${item.category.name}</small>
                  </div>
                  <div class="card-body px-0 pb-0 text-start">
                       <div class="card-img mb-3 w-100" style="height: 150px;">
                            <img src="${item.thumbnail}"
                                 alt="" class="img-fluid rounded-2 object-fit-cover w-100 h-100">
                       </div>
                       <h6 class="ellipsis text-main fw-bold">${item.title}</h6>
                       <p class="ellipsis text-secondary fs-6 mt-1">${item.content}</p>
                  </div>
                </button>
            </div>
        </div>
      `;
    });

    document.querySelector(".row").innerHTML = rows;
  });

function detail(id) {
  sessionStorage.setItem("idArticle",id);
  location.href = "detail.html";
}
