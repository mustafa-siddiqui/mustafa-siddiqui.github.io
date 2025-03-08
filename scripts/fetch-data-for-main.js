/**
 * @file        fetch-data-for-main.js
 * @brief       Script to fetch data from yaml data file for html doc.
 * @author      Mustafa Siddiqui
 * @copyright   (c) 2025
 */

// Fetch YAML file and parse it
fetch('data/main.yaml')
    .then(response => response.text())  // Convert response to text
    .then(data => {
        const parsedData = jsyaml.load(data);  // Parse YAML into JavaScript object
        console.log(parsedData);  // Check the parsed data in the console

        // Manually insert the data into specific HTML sections
        populateIntro(parsedData.intro);
        populateCurrentWork(parsedData.current_work);
        populateExperience(parsedData.experience);
        populateProjects(parsedData.projects);
    })
    .catch(error => {
        console.error('Error loading YAML file:', error);
    });

// Function to populate the Intro section
function populateIntro(introData) {
    const introSection = document.getElementById('intro-section');  // Target the div where intro will be inserted
    if (introSection) {
        introSection.innerHTML = `
      <p>
        I am an embedded software engineer @ <a href="${introData.companyLink}" target="_blank">${introData.company}</a> based
        in ${introData.location}. I graduated from the <a href="${introData.universityLink}" target="_blank">${introData.university}</a>
        majoring in ${introData.major}.
      
        <br><br>

        ${introData.description}

      </p>
    `;
    }
}

// Function to populate the Current Work section
function populateCurrentWork(currentWorkData) {
    const currentWorkSection = document.getElementById('current-work-section');  // Target the div for current work
    if (currentWorkSection) {
        currentWorkSection.innerHTML = `
      <p>
        ${currentWorkData}
      </p>
    `;
    }
}

// Function to populate the Experience section
function populateExperience(experienceData) {
    const experienceSection = document.getElementById('experience-section');  // Target the UL for experience items
    experienceSection.innerHTML = '';  // Clear any existing items

    experienceData.forEach(exp => {
        const listItem = document.createElement('li');
        listItem.classList.add('List-item', 'card');  // Add the necessary classes for styling

        listItem.innerHTML = `
            <div class="List-timestamp">
                <time class="Timestamp" datetime="${exp.date}">${exp.date}</time>
            </div>
            <div class="List-text">
                <div class="full-black">${exp.title}</div>
                @ <a href="${exp.companyLink}" target="_blank" rel="noopener noreferrer">${exp.company}</a>
            </div>
            <p>${exp.description}</p>
        `;

        // Append the list item to the experience section
        experienceSection.appendChild(listItem);
    });
}


// Function to populate the Projects section
function populateProjects(projectsData) {
    const projectsSection = document.getElementById('projects-section');  // Target the UL for project items
    projectsSection.innerHTML = '';  // Clear any existing items
    projectsData.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('List-item', 'card');
        projectItem.innerHTML = `
      <div class="List-timestamp">
        <time class="Timestamp" datetime="${project.date}">${project.date}</time>
      </div>
      <div class="List-text">
        <a href="${project.link}" target="_blank">${project.title}</a>
      </div>
    `;
        projectsSection.appendChild(projectItem);
    });
}


