export default class Presentation {
    constructor(presentation, sectionId, request) {
        this.presentation = presentation;
        this.details = null;
        this.videoSrc = null;
        this.loaded = false;
        this.error = null;
        this.storage = this.loadStorage();
        this.request = request;
        this.sectionId = sectionId;
        this.changeListeners = [];
        
        this.loadDetails();
    }

    addChangeListener(l) {
        this.changeListeners.push(l);
    }

    onChange() {
        for (const l of this.changeListeners) {
            l();
        }
    }
    
    loadStorage() {
        const key = `presenation__${this.uuid()}`;
        const self = this;
        if (Storage) {
            try {
                const storedJSON = window.localStorage.getItem(key);
                let storedData = {};
                if (storedJSON !== null) {
                    try {
                        storedData = JSON.parse(storedJSON);
                        console.log(storedData);
                    } catch (e) {
                        window.localStorage.removeItem(key);
                    }
                }
                return new Proxy(storedData, {
                    set(obj, prop, val) {
                        this[prop] = val;
                        window.localStorage.setItem(key, JSON.stringify(this));
                        self.onChange();
                        return true;
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }

        return {};
    }

    async loadDetails() {
        if (this.loaded) {
            return;
        }
        try {
            const uuid = this.presentation.uuid;
            const response = await this.request(`https://lecturecapture.qut.edu.au/ess/client/api/sections/${this.sectionId}/presentations/${uuid}/details.json`);
            const details = (await response.json()).presentation;
            if (uuid !== details.uuid) {
                throw new Error("UUIDs didn't match");
            }

            const downloadResponse = await this.request(details.vodcast);
            const dp = new DOMParser();
            const downloadPage = dp.parseFromString(await downloadResponse.text(), "text/html");
            const videoSrc = downloadPage.querySelector("a[href$='download']").href;

            this.videoSrc = videoSrc;
            this.details = details;
            this.loaded = true;
            this.onChange();
        } catch (e) {
            this.error = e;
            this.onChange();
        }
    }

    duration() {
        return this.presentation.durationMS / 1000;
    }

    uuid() {
        return this.presentation.uuid;
    }

    title() {
        return this.presentation.title;
    }

    week() {
        return this.presentation.week;
    }

    date() {
        return new Date(this.presentation.startTime);
    }

    thumbnails() {
        return this.presentation.thumbnails;
    }

}

Presentation.SavedData 