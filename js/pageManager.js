'use strict';

const pageManager = (function () {
    'use strict';

    const mainBar = {
        navContainer : document.querySelector('.primary_navigation'),
        navToggle : document.querySelector('.primary_nav_toggle')
    };

    function toggleNavBar () {
        const state = mainBar.navContainer.getAttribute('data-visible') === 'false';
        mainBar.navContainer.setAttribute('data-visible', state);
        mainBar.navToggle.setAttribute('aria-expanded', state);
    }

    mainBar.navToggle.addEventListener('click', toggleNavBar);


    function toggleTheme () {
        document.body.classList.toggle('light-theme');
        const isDark = document.body.classList.toggle('dark-theme');
        
        if (isDark) {
            localStorage.setItem('color-theme','dark-theme');
        } else {
            localStorage.setItem('color-theme','light-theme');
        }
    }
    
    if (document.body.classList.contains('light-theme') && localStorage.getItem('color-theme') === 'dark-theme') {
        toggleTheme();
    }
    
    const btnThemeToggle = document.querySelector('.theme-toggle');
    
    btnThemeToggle.addEventListener('click', toggleTheme);


    let projects = [];

    function createProject(tFragment, data, i) {
        const newP = tFragment.cloneNode(true);

        const container = newP.querySelector('.project');
        container.setAttribute('id',data.id);

        if (i % 2 === 1) container.classList.toggle('right'); 

        newP.querySelectorAll('.p_page').forEach(e => e.href = `${data.project_page}`);

        const image = newP.querySelector('.p_image');
        image.src = `./projects/${data.id}/${data.img_name}`;

        newP.querySelector('.p_header').innerText = `${data.name}`;

        newP.querySelector('.p_description').innerText = `${data.description}`;

        const authors = newP.querySelector('.p_credit');
        const authorTemplate = newP.querySelector('.p_credit a');
        authors.removeChild(authorTemplate);
        
        for (let i = 0; i < data.author.length; i++) {
            const authorData = data.author[i];
            const newAuthor = authorTemplate.cloneNode(true);
            newAuthor.href = `${authorData.page}`;
            newAuthor.innerText = `${authorData.name}`;
            authors.appendChild(newAuthor);

            const punctuation = document.createElement('span');
            punctuation.innerText = i < (data.author.length - 1)? ', ':'.';
            authors.appendChild(punctuation);
        }

        return newP;
    }

    function loadProjects(data) {
        const template = document.querySelector('#project-template');
        const tFragment = template.content;
        const pList = document.querySelector('.projects_preview');

        for (let i = 0; i < data.length; i++) {
            const projectData = data[i];
            const newP = createProject(tFragment, projectData, i);
            pList.appendChild(newP);
        }
    }

    fetch('projects-templates.json')
        .then(response => response.json())
        .then(data => {
            projects = data.projects;
            loadProjects(projects);
        });
    
    
    function matchResults(input) {
        const container = document.querySelector('.c_search_results');
        if (input.length === 0) {
            container.innerHTML = '';
            return;
        }

        const keyWords = input.split(/\s+/).filter(e => e !== '');
        
        let html = '';
        projects.forEach(p => {
            let nMatchs = 0;
            for (let i=0; i< keyWords.length; i++) {
                const w = keyWords[i];
                const rgx = new RegExp(w, 'i');

                if (p.name.match(rgx) || p.description.match(rgx) || p.author[0].name.match(rgx)) {
                    nMatchs++;
                }
                else break;
            }
            if (nMatchs === keyWords.length) {
                html += `<a href="#${p.id}">${p.name}</a>`;
            }
        });
        container.innerHTML = html;
    }

    const search = {
        container : document.querySelector('.c_search_input'),
        input : document.querySelector('#searchInput')
    }
    
    search.input.addEventListener('input', () => matchResults(search.input.value));
    
    function goToFirstResult() {
        const firstResult = document.querySelector('.c_search_results').firstChild;
        if (!firstResult) return;
        firstResult.click();
    }

    search.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') goToFirstResult();
    });

    const btnSearch = document.querySelector('#btnSearch');

    btnSearch.addEventListener('click', goToFirstResult);

    return {

    };
})();

export default pageManager;