const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
// const POSTER_URL = BASE_URL + '/posters/'
const users = []
let filteredUsers = [] //搜尋清單
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const nextButton = paginator.querySelector('.page-item:last-child .page-link');
const previousButton = paginator.querySelector('.page-item:first-child .page-link');
const USERS_PER_PAGE = 12  //新增這行
let currentPage = 1


function renderUserList(data) {
    let rawHTML = ''
    data.forEach((item) => {
        rawHTML += `<div class="col-sm-2">
    <div class="mb-3">
        <div class="border border-3 border-dark border-secondary text-center card">
            <img src="${item.avatar}" class="border border-3 border-dark rounded-circle card-img-top" alt="User Poster" style="transform: scale(0.8);">
            <div class="card-body">
                <h5 class="card-title text-truncate"><strong>${item.surname} ${item.name}</strong></h5>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-show-user" data-bs-toggle="modal"
                    data-bs-target="#user-modal" data-id="${item.id}">
                    More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">
                    +
                </button>
            </div>
        </div>
    </div>
</div>`
    })
    dataPanel.innerHTML = rawHTML
}

axios
    .get(INDEX_URL) // 修改這裡
    .then((response) => {
        console.log(response)
        // console.log(response.data.results)
        users.push(...response.data.results)
        renderPaginator(users.length)
        renderUserList(getUsersByPage(1)) //修改這裡
    })
    .catch((err) => console.log(err))


function showUserModal(id) {
    const userTitle = document.querySelector('#user-modal-title');
    const userImage = document.querySelector('#user-modal-image')
    const userEmail = document.querySelector('#user-modal-email')
    const userGender = document.querySelector('#user-modal-gender')
    const userAge = document.querySelector('#user-modal-age')
    const userRegion = document.querySelector('#user-modal-region')
    const userBirthday = document.querySelector('#user-modal-birthday')
    // console.log(INDEX_URL + id)
    axios.get(INDEX_URL + id).then((response) => {
        // console.log(response.data)
        const data = response.data
        userTitle.innerText = `${data.surname} ${data.name}`
        userImage.innerHTML = `<img src="${data.avatar}" alt="user-poster" class="img-fluid">`
        userEmail.innerText = `Email:${data.email}`
        userGender.innerText = `Gender:${data.gender}`
        userAge.innerText = `Age:${data.age}`
        userRegion.innerText = `Region:${data.region}`
        userBirthday.innerText = `Birthday:${data.birthday}`
    })
}

function addToFavorite(id) {
    // users.forEach((user) => { console.log(user.id, typeof (user.id), typeof (Number(id))) })
    const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []

    const user = users.find((user) => user.id === Number(id))
    console.log(user)

    if (list.some((user) => user.id === Number(id))) {
        return alert('此使用者已經在收藏清單中！')
    }

    list.push(user)
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

function getUsersByPage(page) {
    //計算起始 index 
    const startIndex = (page - 1) * USERS_PER_PAGE
    //回傳切割後的新陣列
    return users.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
    //製作 template 
    let rawHTML = ''
    rawHTML += `<li class="page-item">
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
    </li>`
    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    rawHTML += `<li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>`
    //放回 HTML
    paginator.innerHTML = rawHTML
}




dataPanel.addEventListener('click', function onPanelClicked(event) {
    // console.log(event.target)
    if (event.target.matches('.btn-show-user')) {
        // console.log(event.target.dataset.id)
        showUserModal(event.target.dataset.id)  // 修改這裡
    } else if (event.target.matches('.btn-add-favorite')) {
        // console.log(event.target.dataset.id)
        addToFavorite(event.target.dataset.id)
    }
})


// listen to search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    console.log(keyword)

    filteredUsers = users.filter((user) =>
        user.surname.toLowerCase().includes(keyword) || user.name.toLowerCase().includes(keyword)
    )
    console.log(filteredUsers)
    if (filteredUsers.length === 0) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
    }

    // renderPaginator(filteredMovies.length)
    // renderMovieList(getMoviesByPage(1))
    renderPaginator(filteredUsers.length)
    renderUserList(getUsersByPage(1))

})


paginator.addEventListener('click', function onPaginatorClicked(event) {
    //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== 'A') return
    console.log(event.target.innerText)
    //透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page)
    if (!isNaN(page)) currentPage = page

    if (event.target.innerText === 'Previous' && currentPage > 1) {
        console.log(currentPage - 1, typeof (currentPage), typeof (1))
        currentPage--
        // renderUserList(getUsersByPage(currentPage))
    } else if (event.target.innerText === 'Next') {
        if (currentPage < Math.ceil(users.length / USERS_PER_PAGE)) {
            console.log(currentPage, Math.ceil(users.length / USERS_PER_PAGE))
            currentPage++
        }
        // renderUserList(getUsersByPage(currentPage))
    }

    //更新畫面
    renderUserList(getUsersByPage(currentPage))
    // console.log('currentPage', currentPage)

})