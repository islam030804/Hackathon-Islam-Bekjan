const API = "http://localhost:8000/products";

// ? переменные для инпутов (для добавления товаров)
let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let descr = document.querySelector("#descr");
let number = document.querySelector("#number");
let btnAdd = document.querySelector("#btn-add");
let ddt = document.querySelector("#ddt");
let btnOpenAdd = document.querySelector(".add-btn button");
let addPanel = document.querySelector(".add-panel");

// ? переменные для инпутов (для редактирования товаров)
let editTitle = document.querySelector("#edit-name");
let editPrice = document.querySelector("#edit-surname");
let editDescr = document.querySelector("#edit-descr");
let editImage = document.querySelector("#edit-number");
let btnSaveEdit = document.querySelector("#btn-save-edit");

// ? блок куда добавляются карточки товаров
let list = document.querySelector("#contact-list");

// ? search инпут в навбаре для поиска
let searchInp = document.querySelector("#search");
let searchVal = "";

// ?pagination
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let paginationList = document.querySelector(".pagination-list");
let currentPage = 1;
let pageTotalCount = 1;
let limit = 2;

btnAdd.addEventListener("click", async () => {
  let obj = {
    name: name.value,
    surname: surname.value,
    descr: descr.value,
    number: number.value,
    ddt: ddt.value,
  };
  if (
    !obj.name.trim() ||
    !obj.surname.trim() ||
    !obj.descr.trim() ||
    !obj.number.trim() ||
    !obj.ddt.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  name.value = "";
  surname.value = "";
  descr.value = "";
  number.value = "";
  ddt.value = "";

  render();
});

// ? Отображение
async function render() {
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=${limit}`
  ).then((res) => res.json());

  drawPageButtons();
  list.innerHTML = "";

  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.innerHTML = `<div class="card mb-3 me-4" style="max-width: 18rem;">
    <div class="card-header d-flex flex-direction: column;">${element.surname} ${element.name}</div>
    <div class="card-body text-secondary">
      <h5 class="card-title">Недельный KPI ${element.descr} Месячный KPI ${element.ddt}</h5>
      <p class="card-text">${element.number}</p>
      <a href="#" class="btn btn-primary btn-delete" id=${element.id}>Удалить</a>
      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id} class="btn btn-primary btn-edit">Изменить</a>
    </div>
  </div>`;
    list.append(newElem);
  });
}

render();

// ? styles
addPanel.style.display = "none!important";

// ? Открытие окна добавления
btnOpenAdd.addEventListener("click", () => {
  if (addPanel.classList.contains("add-panel")) {
    addPanel.classList.add("add-panel-db");
    addPanel.classList.remove("add-panel");
    // i++
  } else {
    addPanel.classList.add("add-panel-db1");
    setTimeout(cla, 1000);
  }
});

function cla() {
  addPanel.classList.remove("add-panel-db1");
  addPanel.classList.remove("add-panel-db");
  addPanel.classList.add("add-panel");
}

// ? удаление продукта
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let answer = confirm("Вы уверены");

    if (answer) {
      let id = e.target.id;
      console.log(id);
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      render();
    }
  }
});

// ? поиск
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  currentPage = 1;
  render();
});

// ? pagination
function drawPageButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / limit);
      paginationList.innerHTML = "";

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page = document.createElement("li");
          page.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page);
        } else {
          let page = document.createElement("li");
          page.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
  }
});

// для заполнения полей модалки
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.name;
        editPrice.value = data.surname;
        editDescr.value = data.descr;
        editImage.value = data.number;

        btnSaveEdit.setAttribute("id", data.id);
      });
  }
});

// кнопка из модалки для сохранения изменений
btnSaveEdit.addEventListener("click", (e) => {
  let id = e.target.id;

  let name = editTitle.value;
  let surname = editPrice.value;
  let descr = editDescr.value;
  let number = editImage.value;

  let edittedContact = {
    name: name,
    surname: surname,
    descr: descr,
    number: number,
  };
  saveEdit(edittedContact, id);
});

function saveEdit(edittedContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(edittedContact),
  }).then(() => {
    render();
  });
}
