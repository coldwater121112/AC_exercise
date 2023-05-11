const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
// const POSTER_URL = BASE_URL + '/posters/'
const users = JSON.parse(localStorage.getItem('favoriteUsers'))
// console.log(users)
let filteredUsers = [] //搜尋清單
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const USERS_PER_PAGE = 12  //新增這行


function renderUserList(data) {
    console.log(data)
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
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">
                    X
                </button>
            </div>
        </div>
    </div>
</div>`
    })
    dataPanel.innerHTML = rawHTML
}



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

function removeFavorite(id) {
    if (!users || !users.length) return

    const usersIndex = users.findIndex((user) => user.id === Number(id))

    users.splice(usersIndex, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(users))
    renderUserList(users)
}




dataPanel.addEventListener('click', function onPanelClicked(event) {
    // console.log(event.target)
    if (event.target.matches('.btn-show-user')) {
        // console.log(event.target.dataset.id)
        showUserModal(event.target.dataset.id)  // 修改這裡
    } else if (event.target.matches('.btn-remove-favorite')) {
        // console.log(event.target.dataset.id)
        removeFavorite(event.target.dataset.id)
    }
})

renderUserList(users)

