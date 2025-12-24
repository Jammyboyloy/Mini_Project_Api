let id = sessionStorage.getItem("idArticle");

fetch(baseUrl + `/articles/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((item) => {
    document.querySelector(".container-detail").innerHTML = `
          <div class="card rounded-2 bg-main border-0">
              <div class="card-header p-0 bg-main border-0 d-flex align-items-center gap-2">
                   <img src="${item.data.creator.avatar}" alt=""
                        class="img-fluid object-fit-cover rounded-circle" style="width: 50px; height: 50px;">
                   <div class="d-flex flex-column gap-1">
                        <h6 class="p-0 m-0 fs-6 text-main name">${item.data.creator.firstName} ${item.data.creator.lastName}</h6>
                        <h6 class="p-0 m-0 fs-6 text-secondary fst-italic">Published on: Dec 23, 2025
                        </h6>
                   </div>
                   <small
                        class="fs-6 bg-primary w-fit h-fit rounded-4 px-3 text-primary ms-auto"
                        style="padding: 2px;">${item.data.category.name}</small>
              </div>
              <div class="card-body px-0 pb-1 text-start">
                   <div class="card-img mb-3" style="height: 300px;">
                        <img src="${item.data.thumbnail}" alt=""
                             class="img-fluid rounded-2 object-fit-cover w-100 h-100">
                   </div>
                   <h5 class="text-main fw-bold">${item.data.title}</h5>
                   <p class="text-secondary fs-6 mt-1">${item.data.content}</p>
              </div>
          </div>
  `;
  });
