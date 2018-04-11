class Course {
    constructor() {
        this.data = null;
        this.error = null;
        this.presentations = null;
    }

    async load(id) {
        try {
            const sectionDataUrl = (id, page) =>
                `/ess/client/api/sections/${id}/section-data.json?pageSize=${page}`;
            const initPageSize = 100;
            const initResponse = await fetch(
                sectionDataUrl(id, initPageSize),
                {
                    credentials: "include"
                }
            );
            const initData = await initResponse.json();
            const totalResults = initData.section.presentations.totalResults;
            if (totalResults > initPageSize) {
                const response = await fetch(
                    sectionDataUrl(id, totalResults),
                    {
                        credentials: "include"
                    }
                );
                this.data = (await response.json()).section;
            } else {
                this.data = initData;
            }
        } catch (e) {
            this.error = e;
        }
    }
    
    async loadPresentations() {
        
    }

}