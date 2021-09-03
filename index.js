import { SearchService } from "./searchService.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
details {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: .5em .5em 0;
}

summary {
    font-weight: bold;
    margin: -.5em -.5em 0;
    padding: .5em;
}

details[open] {
    padding: .5em;
}

details[open] summary {
    border-bottom: 1px solid #aaa;
    margin-bottom: .5em;
}
</style>
<div>
    <slot>
        <header>
            <h3 part="title">{{jobTitle}}</h3>
            <span>{{jobCategory}}</span>
            <time>{{dateLastPublished}}</time>
        </header>
        <main>
        <details>
            <summary>{{jobSummary}}</summary>
            <p>{{jobDescription}}</p>
        </details>
        </main>
        <footer>
            <button>Apply</button>
        </footer>
    </slot>
</div>
`

export class CareerPortal extends HTMLElement {
    searchService;
    element;
    currentJobs;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.searchService = new SearchService(this.swimlane, this.corpToken);
        this.element = shadowRoot.querySelector('div');
        this.setJobs();
    }

    static get observedAttributes() {
        return [ 'corpToken', 'swimlane', 'jobsPerPage' ];
    }

    get corpToken() {
        return this.getAttribute('corpToken');
    }

    get swimlane() {
        return this.getAttribute('swimlane');
    }

    get jobsPerPage() {
        return this.getAttribute('jobsPerPage');
    }


    async setJobs() {
        const res = await this.searchService.getjobs('', {}, this.jobsPerPage);
        this.currentJobs = await res.json();
        this.createJobElement();
    }

    createJobElement() {
        this.currentJobs.data.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.setAttribute('class', 'job');
            jobElement.appendChild(this.element.querySelector('slot').cloneNode(true));

            jobElement.innerHTML = jobElement.innerHTML
            .replace('{{jobTitle}}', job.title)
            .replace('{{jobCategory}}', job.publishedCategory?.name)
            .replace('{{dateLastPublished}}', new Date(job.dateLastPublished).toLocaleDateString())
            .replace('{{jobSummary}}', 'View Description')
            .replace('{{jobDescription}}', job.publicDescription)
            this.element.appendChild(jobElement);
            jobElement.querySelector('button').addEventListener('click', value => {
                this.openJob(job.id);
            });
        });
    }

    openJob(itemId) {
        console.log(itemId);
    }

    connectedCallback() {
    }
}

window.customElements.define('career-portal', CareerPortal);