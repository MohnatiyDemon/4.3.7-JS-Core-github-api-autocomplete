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
		autocompleteResults.innerHTML = ''
		return
	}
	const repositories = await fetchRepositories(query)
	showAutocompleteResults(repositories)
}

function showAutocompleteResults(repositories) {
	autocompleteResults.innerHTML = ''
	repositories.forEach(repo => {
		const item = document.createElement('div')
		item.className = 'autocomplete-item'
		item.textContent = repo.full_name
		item.onclick = () => addRepository(repo)
		autocompleteResults.appendChild(item)
	})
}

function addRepository(repo) {
	const repoItem = document.createElement('div')
	repoItem.className = 'github-rep-item'
	repoItem.innerHTML = `
        <span>Name: ${repo.name} <br> Owner: ${repo.owner.login} <br> Stars: ${repo.stargazers_count}	&#9734; </span>
        <button class="remove-btn">&#215;</button>
    `
	repoItem.querySelector('.remove-btn').onclick = () => {
		repoList.removeChild(repoItem)
	}
	repoList.appendChild(repoItem)
	searchInput.value = ''
	autocompleteResults.innerHTML = ''
}

searchInput.addEventListener('input', debounce(handleInput, 200))
