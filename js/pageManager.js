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

    function createProject(tFragment, data) {
        const newP = tFragment.cloneNode(true);

        newP.querySelectorAll('.p_page').forEach(e => e.href = `${data.project_page}`);

        const image = newP.querySelector('.p_image');
        image.src = `./projects/${data.id}/${data.img_name}`

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

        data.forEach(projectData => {
            const newP = createProject(tFragment, projectData);
            pList.appendChild(newP);
        });
    }

    fetch('projects-templates.json')
        .then(response => response.json())
        .then(data => loadProjects(data.projects));
    
    return {

    };
})();

export default pageManager;