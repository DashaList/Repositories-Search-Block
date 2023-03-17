
let form = document.querySelector('.rep-search__form');
let repSearchField = document.querySelector('.rep-search__field');
let searchLine = document.getElementById('search-line');
let searchError = document.querySelector('.search-line-error');

let validateSearch = () => {

  if (searchLine.value.length < 2) {
    searchLine.classList.add('error');
    searchError.textContent = "Минимальное количество символов - 2";
    return false;
  }
  if (searchLine.value.length > 100) {
    searchLine.classList.add('error');
    searchError.textContent = "Максимальное количество символов - 100";
    return false;
  }
  
  searchLine.classList.remove('error');
  searchError.textContent = "";
  return true;
};


searchLine.addEventListener('blur', () => {
  validateSearch();
});


searchLine.addEventListener('input', () => {
  if (searchLine.classList.contains('error')) {
    searchLine.classList.remove('error');
    searchError.textContent = "";
  }
});


form.addEventListener('submit', (event) => {
  event.preventDefault();

  let validSearch = validateSearch();

  if (!validSearch) {
    return;
  }

  submit();  
});

function submit() {

    repSearchField.innerHTML = "";
    repSearchField.classList.remove('block');
    searchRep();
  
    searchLine.blur();
    searchLine.value = '';
};  

let searchRep = async () => {
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchLine.value} in:name&per_page=10`);
    if (response.ok) {
        let data = await response.json();
        if (data.items.length == 0) {
            showErrorMsg("Ничего не найдено.")
        }
        data.items.forEach((item) => {
            showRepository(item);
        });
    } else {
        showErrorMsg("Произошла ошибка.");
    }
};

let showRepository = (rep) => {
    repSearchField.style.display = "block";
    let repositoryEl = document.createElement('div');
    repositoryEl.classList.add('rep', 'block');
    repositoryEl.innerHTML =
    `<h3 class="rep__rep-name"><a href="${rep.html_url}" target="_blank">${rep.name}</a></h3>`;
    repSearchField.append(repositoryEl);

    if (rep.description) {
      repositoryEl.insertAdjacentHTML('beforeend', `<p class="rep__description">${rep.description}</p>`);
    }

    repositoryEl.insertAdjacentHTML('beforeend',
      `<p class="rep__user-name">Имя владельца: ${rep.owner.login}</p>
      <p class="rep__language">Язык: ${rep.language}</p>`);
    
};

let showErrorMsg = (message) => {
    repSearchField.style.display = "block";
    repSearchField.classList.add('block');
    let errorEl = document.createElement('span');
    errorEl.classList.add('error-message');
    errorEl.textContent = message;
    repSearchField.append(errorEl);
};