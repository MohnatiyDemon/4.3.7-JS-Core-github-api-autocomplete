const searchInput = document.querySelector('.autocomplete-container__input')
const autocompleteResults = document.querySelector(
	'.autocomplete-container__results'
)
const repoList = document.querySelector('.repo-list')
let timeout

async function fetchRepositories(query) {
	const response = await fetch(
		`https://api.github.com/search/repositories?q=${query}&per_page=5`
	)
	const data = await response.json()
	return data.items
}

function debounce(fn, delay) {
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn(...args), delay)
	}
}

async function handleInput(event) {
	const query = event.target.value
	if (!query) {
		autocompleteResults.textContent = ''
		return
	}
	const repositories = await fetchRepositories(query)
	showAutocompleteResults(repositories)
}

function showAutocompleteResults(repositories) {
	autocompleteResults.innerHTML = ''
	const fragment = document.createDocumentFragment()
	repositories.forEach(repo => {
		const item = document.createElement('div')
		item.className = 'autocomplete-item'
		item.textContent = repo.full_name
		item.addEventListener('click', () => addRepository(repo))
		fragment.appendChild(item)
	})
	autocompleteResults.appendChild(fragment)
}

function addRepository(repo) {
	const repoItem = document.createElement('div')
	repoItem.className = 'github-rep-item'

	const nameSpan = document.createElement('span')
	nameSpan.textContent = `Name: ${repo.name}`

	const ownerSpan = document.createElement('span')
	ownerSpan.textContent = `Owner: ${repo.owner.login}`

	const starsSpan = document.createElement('span')
	starsSpan.textContent = `Stars: ${repo.stargazers_count} ★`

	const removeButton = document.createElement('button')
	removeButton.className = 'remove-btn'
	removeButton.textContent = '✕'
	removeButton.addEventListener('click', () => {
		repoItem.remove()
	})

	repoItem.appendChild(nameSpan)
	repoItem.appendChild(ownerSpan)
	repoItem.appendChild(starsSpan)
	repoItem.appendChild(removeButton)
	repoList.appendChild(repoItem)

	searchInput.value = ''
	autocompleteResults.textContent = ''
}

searchInput.addEventListener('input', debounce(handleInput, 200))
