/**
 * @file        fetch-data-for-main.js
 * @description Script to fetch data from yaml data file and populate the page.
 * @author      Mustafa Siddiqui
 * @copyright   (c) 2025
 */

fetch('data/main.yaml')
    .then(response => response.text())
    .then(data => {
        const parsed = jsyaml.load(data);
        populateHeader(parsed);
        populateSections(parsed.sections);
        populateFooter(parsed);
    })
    .catch(error => {
        console.error('Error loading YAML file:', error);
    });

/**
 * Populate the page header with the user's first name.
 * @param {Object} data - Parsed YAML data object containing a 'name' field.
 */
function populateHeader(data) {
    const heading = document.getElementById('site-heading');
    if (heading) {
        heading.textContent = "Hi, I'm " + data.name.split(' ')[0] + " ";
    }
}

/**
 * Iterate over sections from the YAML data and render each one based on its type.
 * Supported types: 'prose', 'timeline', 'link-list'. Each section may optionally
 * include a 'heading' (rendered as h2) and a 'footer' (appended as inline HTML).
 * @param {Array<Object>} sections - Array of section objects from the parsed YAML data.
 */
function populateSections(sections) {
    const container = document.getElementById('content');
    if (!container) return;

    sections.forEach(section => {
        if (section.heading) {
            const h2 = document.createElement('h2');
            h2.textContent = section.heading;
            container.appendChild(h2);
        }

        switch (section.type) {
            case 'prose':
                renderProse(container, section);
                break;
            case 'timeline':
                renderTimeline(container, section);
                break;
            case 'link-list':
                renderLinkList(container, section);
                break;
        }

        if (section.sectionFooter) {
            appendSectionFooter(container, section.sectionFooter);
        }
    });
}

/**
 * Render a 'prose' section as a card with free-form HTML content.
 * @param {HTMLElement} container - Parent DOM element to append to.
 * @param {Object} section - Section object with a 'body' field containing HTML string.
 */
function renderProse(container, section) {
    const wrapper = document.createElement('div');
    wrapper.className = 'Article-body card';

    const p = document.createElement('p');
    p.innerHTML = section.body.trim();
    wrapper.appendChild(p);

    container.appendChild(wrapper);
}

/**
 * Render a 'timeline' section as a list of cards with timestamps.
 * Each item displays a title, company with link, date, and description.
 * @param {HTMLElement} container - Parent DOM element to append to.
 * @param {Object} section - Section object with an 'items' array. Each item has
 *     'title', 'company', 'companyLink', 'date', and 'description' fields.
 */
function renderTimeline(container, section) {
    const wrapper = document.createElement('div');
    wrapper.className = 'Article-body';

    const ul = document.createElement('ul');
    ul.className = 'List';

    section.items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'List-item card';
        li.innerHTML =
            '<div class="List-timestamp">' +
                '<time class="Timestamp" datetime="' + item.date + '">' + item.date + '</time>' +
            '</div>' +
            '<div class="List-text">' +
                '<div class="full-black">' + item.title + '</div>' +
                '@ <a href="' + item.companyLink + '" target="_blank" rel="noopener noreferrer">' + item.company + '</a>' +
                '<p></p>' +
            '</div>' +
            '<p>' + item.description.trim() + '</p>';
        ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    container.appendChild(wrapper);
}

/**
 * Render a 'link-list' section as a list of cards with timestamps and links.
 * Each item displays a title as a hyperlink alongside a date.
 * @param {HTMLElement} container - Parent DOM element to append to.
 * @param {Object} section - Section object with an 'items' array. Each item has
 *     'title', 'date', and 'link' fields.
 */
function renderLinkList(container, section) {
    const wrapper = document.createElement('div');
    wrapper.className = 'Article-body';

    const ul = document.createElement('ul');
    ul.className = 'List';

    section.items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'List-item card';
        li.innerHTML =
            '<div class="List-timestamp">' +
                '<time class="Timestamp" datetime="' + item.date + '">' + item.date + '</time>' +
            '</div>' +
            '<div class="List-text">' +
                '<a href="' + item.link + '" target="_blank" rel="noopener noreferrer">' + item.title + '</a>' +
            '</div>';
        ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    container.appendChild(wrapper);
}

/**
 * Append inline HTML text to the end of the last rendered section's container.
 * Used for supplementary text that belongs visually with the preceding section.
 * @param {HTMLElement} container - Parent DOM element whose last child will be appended to.
 * @param {string} sectionFooter - HTML string to append.
 */
function appendSectionFooter(container, sectionFooter) {
    const prev = container.lastElementChild;
    if (prev) {
        prev.insertAdjacentHTML('beforeend', '\n' + sectionFooter.trim());
    }
}

/**
 * Populate the site footer with copyright info and social media icon links.
 * Social entries with 'copyright: true' render as the copyright line; the rest
 * render as icon links separated by '|'.
 * @param {Object} data - Parsed YAML data object containing 'name' and 'social' fields.
 */
function populateFooter(data) {
    const iconsDiv = document.getElementById('footer-icons');
    if (!iconsDiv || !data.social) return;

    const copyrightEntry = data.social.find(s => s.copyright);
    if (copyrightEntry) {
        const copyrightDiv = document.createElement('div');
        copyrightDiv.className = 'Copyright List-timestamp';
        copyrightDiv.innerHTML =
            '<a href="' + copyrightEntry.link + '" target="_blank" rel="noopener noreferrer">' +
            '<span>&copy;</span> ' + data.name + '.</a>';
        iconsDiv.appendChild(copyrightDiv);
    }

    const linkEntries = data.social.filter(s => !s.copyright);
    linkEntries.forEach((entry, i) => {
        iconsDiv.appendChild(document.createTextNode('\n'));
        const a = document.createElement('a');
        a.href = entry.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const icon = document.createElement('i');
        icon.className = 'fa fa-' + entry.platform;
        a.appendChild(icon);
        iconsDiv.appendChild(a);

        if (i < linkEntries.length - 1) {
            iconsDiv.appendChild(document.createTextNode('\n|  '));
        }
    });
    iconsDiv.appendChild(document.createTextNode('\n'));
}
