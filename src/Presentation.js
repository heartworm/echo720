export default class Presentation {
    constructor(presentation, sectionId, request) {
        this.presentation = presentation;
        this.details = null;
        this.videoSrc = null;
        this.loaded = false;
        this.error = null;
        this.request = request;
        this.sectionId = sectionId;
        this.changeListeners = [];
        this.storageKey = `presenation__${this.uuid()}`;
        this.storage = this.loadStorage();
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
        const self = this;
        if (Storage) {
            try {
                const storedJSON = window.localStorage.getItem(this.storageKey);
                let storedData = {};
                if (storedJSON !== null) {
                    try {
                        storedData = JSON.parse(storedJSON);
                        console.log(storedData);
                    } catch (e) {
                        window.localStorage.removeItem(this.storageKey);
                    }
                }
                return new Proxy(storedData, {
                    set: (obj, prop, val) => {
                        obj[prop] = val;
                        window.localStorage.setItem(self.storageKey, JSON.stringify(obj));
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

    resetStorage() {
        if (Storage) {
            window.localStorage.removeItem(this.storageKey);
        }
        this.storage = this.loadStorage();
        this.onChange();
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

    unwatched() {
        return !this.ended() && this.currentTime === 0;
    }

    setCurrentTime(c) {
        this.storage.currentTime = c;
    }

    currentTime() {
        return this.storage.currentTime || 0;
    }

    ended() {
        return this.storage.ended === true;
    }
    
    setEnded() {
        this.storage.ended = true;
    }

    setLastWatched() {
        this.storage.lastWatched = new Date();
    }

    lastWatched() {
        return this.storage.lastWatched !== undefined ? new Date(this.storage.lastWatched) : null;
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