let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");
let id = sessionStorage.getItem("idArticle");

fetch(baseUrl + `/articles/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((item) => {
    let htmlText = contentToHtml(item.data.content);
    document.querySelector(".detail-container").innerHTML = `
      <div class="card rounded-4 bg-main border-0 shadow-sm w-100">
          <img src="${
            item.data.thumbnail
          }" alt="" class="img-fluid object-fit-cover"
            style="height: 300px; width: 100%; border-radius: 8px 8px 0 0;">
          <div class="card-body text-start">
            <div class="d-flex justify-content-center align-items-center gap-2 mb-4">
              <img src="${
                item.data.creator.avatar
              }" alt="" class="img-fluid object-fit-cover rounded-circle"
                style="width: 50px; height: 50px;">
              <div class="d-flex flex-column gap-1">
                <h6 class="p-0 m-0 fs-6 text-main name">${
                  item.data.creator.firstName
                } ${item.data.creator.lastName}</h6>
                <h6 class="p-0 m-0 fs-6 text-secondary fst-italic">Published on: ${formatDate(
                  item.data.createdAt
                )}
                </h6>
              </div>
              <small class="fs-6 bg-primary w-fit h-fit rounded-4 px-3 text-primary ms-auto" style="padding: 2px;">${
                item.data.category?.name ?? "null"
              }</small>
            </div>
            <h5 class="text-main fw-bold">${item.data.title}</h5>
            <div class="text-danger fs-6 mt-1">${htmlText}</div>
          </div>
      </div>  
  `;
  });

function contentToHtml(content) {
  if (!content) return "";
  else if (
    typeof content === "string" &&
    !content.startsWith("<") &&
    !content.startsWith("{")
  )
    return content;
  else if (typeof content === "string" && content.startsWith("<"))
    return content;
  else {
    try {
      const delta = typeof content === "string" ? JSON.parse(content) : content;
      let html = "", currentList = null;

      delta.ops.forEach((op) => {
        if (op.insert.image) {
          if (currentList) {
            html += currentList === "ordered" ? "</ol>" : "</ul>";
            currentList = null;
          }
          html += `<img src="${op.insert.image}" alt="" /><br>`;
        } else if (typeof op.insert === "string") {
          let text = op.insert.replace(/\n$/, "");
          if (!text) return;

          if (op.attributes?.bold) text = `<strong>${text}</strong>`;
          if (op.attributes?.italic) text = `<em>${text}</em>`;

          if (op.attributes?.list) {
            if (currentList !== op.attributes.list) {
              if (currentList)
                html += currentList === "ordered" ? "</ol>" : "</ul>";
              html += op.attributes.list === "ordered" ? "<ol>" : "<ul>";
              currentList = op.attributes.list;
            }
            html += `<li>${text}</li>`;
          } else {
            if (currentList) {
              html += currentList === "ordered" ? "</ol>" : "</ul>";
              currentList = null;
            }
            html += `<p>${text}</p>`;
          }
        }
      });

      if (currentList) html += currentList === "ordered" ? "</ol>" : "</ul>";
      return html;
    } catch {
      return typeof content === "string" ? content : "";
    }
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
