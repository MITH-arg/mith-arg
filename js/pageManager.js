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

        newP.querySelector('.p_page').href = `${data.project_page}`;

        const image = newP.querySelector('.p_image');
        image.src = `./projects/${data.id}/${data.img_name}`

        newP.querySelector('.p_header').innerText = `${data.name}`;

        newP.querySelector('.p_description').innerText = `${data.description}`;

        const author = newP.querySelector('.p_credit a');
        author.href = `${data.author_page}`;
        author.innerText = `${data.author}`;

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

    fetch('../projects/projects-templates.json')
        .then(response => response.json())
        .then(data => {
            loadProjects(data.projects);
        });
    
    return {

    };
})();

export default pageManager;