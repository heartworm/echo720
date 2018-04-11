<template>
    <div class="echo720-app">

        <div class="echo720-app__container" v-if="loaded">
            <div class="echo720-app__chooser" v-show="chosenPresentation === null">
                <div class="echo720-app__header">
                    <h1 class="echo720-app__course-title">{{courseTitle}}</h1>
                </div>
                <button class="echo720-app__exit-button" v-on:click="close">Exit Echo720</button>

                <div class="echo720-app__list">
                    <presentation-listing v-bind:presentation="presentation" v-for="presentation in presentations" :key="presentation.uuid()" v-on:click.native="chosenPresentation = presentation" />
                </div>
            </div>
            <presentation-viewer v-if="chosenPresentation !== null" v-bind:presentation="chosenPresentation" v-bind:exit="stopVideo"/>
        </div>

        <div class="echo720-app__overlay" v-else>
            <p v-if="error !== null">An error was encountered</p>
            <p v-else>Loading...</p>
        </div>
    </div>
</template>

<script>

import PresentationListing from "./PresentationListing.vue";
import PresentationViewer from "./PresentationViewer.vue";
import Presentation from "./Presentation.js";
export default {
    name: "echo720-app",
    data: () => ({
        section: null,
        user: null,
        error: null,
        loaded: false,
        presentations: null,
        chosenPresentation: null,
    }),
    computed: {
        courseTitle() {
            return this.section.course.name;
        },
    },
    mounted() {
        window.echo720Loader.appMounted(this.$el);
        this.load();
    },
    methods: {
        close() {
            window.echo720Loader.setVisible(false);
        },
        async load() {
            this.sectionId = window.EC.sectionId;
            try {
                const sectionDataUrl = (id, page) =>
                    `/ess/client/api/sections/${id}/section-data.json?pageSize=${page}`;
                const initPageSize = 100;
                const initResponse = await this.request(sectionDataUrl(this.sectionId, initPageSize));
                const initData = await initResponse.json();
                const totalResults = initData.section.presentations.totalResults;
                if (totalResults > initPageSize) {
                    const response = await this.request(sectionDataUrl(this.sectionId, totalResults));
                    const data = await response.json();
                    this.section = data.section;
                    this.user = data.user;
                } else {
                    this.section = initData.section;
                    this.user = initData.user;
                }
                this.presentations = this.section.presentations.pageContents.map(p => new Presentation(p, this.sectionId, this.request));
                this.loaded = true;                
            } catch (e) {
                console.error(e);
                this.error = e;
            }
        },
        async request(url, init) {
            const response = await fetch(url, {
                credentials: 'include',
                redirect: 'manual',
                ...init
            });
            if (response.status !== 200) {
                console.error(response);
                this.error = true;
                this.loaded = false;
            }
            return response;
        },
        stopVideo() {
            this.chosenPresentation = null;
        }
    },
    components: {
        PresentationListing,
        PresentationViewer
    }
};
</script>

<style>
.echo720-app {
    font-family: sans-serif;
    display: block;
    flex-direction: column;
    max-width: 1024px;
    margin: 30px auto;
}
.echo720-app__container {
    display: flex;
    flex-wrap: wrap;
}
.echo720-app__list {
    display: flex;
    flex: 40%;
    flex-direction: column;
}
.echo720-app__header {
    flex: 100%;
    padding: 1em;
    display: flex;
}
.echo720-app__course-title {
    flex-grow: 1;
    margin: 0;
}
.echo720-app__exit-button {
    background: none;
    border: none;
    border-left: 1px solid gray;
}
</style>
