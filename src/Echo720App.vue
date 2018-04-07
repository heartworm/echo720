<template>
    <div class="echo720-app">

        <article class="echo720-app__container" v-if="sectionData !== null">
            <div class="echo720-app__header">   
                <h1 class="echo720-app__course-title">{{courseTitle}}</h1>
                <button class="echo720-app__exit-button" v-on:click="close">Exit Echo720</button>
            </div>

            <div class="echo720-app__list">
                <presentation-listing 
                v-bind:presentation="presentation" v-for="presentation in presentations"
                :key="presentation.uuid" v-on:click.native="chosenPresentation = presentation"/>
            </div>

            <presentation-viewer v-bind:sectionId="sectionId" v-bind:presentation="chosenPresentation"/>

        </article>
    </div>
</template>

<script>
import PresentationListing from "./PresentationListing.vue";
import PresentationViewer from "./PresentationViewer.vue";
export default {
    name: "echo720-app",
    data: () => ({
        sectionId: null,
        sectionData: null,
        currentDetails: null,
        error: false,
        msg: "Welcome to Your Vue.js App",
        chosenPresentation: null,
    }),
    computed: {
        presentations() {
            return this.sectionData.presentations.pageContents;
        },
        courseTitle() {
            return this.sectionData.course.name;
        }
    },
    mounted() {
        window.echo720Loader.appMounted(this.$el);
        this.loadData();
    },
    methods: {
        close() {
            window.echo720Loader.setVisible(false);
        },
        async loadData() {
            this.sectionId = window.EC.sectionId;
            try {
                const sectionDataUrl = (id, page) =>
                    `/ess/client/api/sections/${id}/section-data.json?pageSize=${page}`;
                const initPageSize = 100;
                const initResponse = await fetch(
                    sectionDataUrl(this.sectionId, initPageSize),
                    {
                        credentials: "include"
                    }
                );
                const initData = await initResponse.json();
                const pageSize = initData.section.presentations.totalResults;
                const response = await fetch(
                    sectionDataUrl(this.sectionId, pageSize),
                    {
                        credentials: "include"
                    }
                );
                this.sectionData = (await response.json()).section;
            } catch (e) {
                this.error = true;
                throw e;
            }
            console.log(this.sectionData);
        },
        async loadPresentationDetails(ev) {}
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
