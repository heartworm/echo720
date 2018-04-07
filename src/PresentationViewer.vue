<template>
    <article class="echo720-viewer">
        <div v-if="presentation===null">
            choose a vid
        </div>
        <div v-else-if="!loaded">
            loading...
        </div>
        <div v-else> 
            <video ref="video" class="echo720-viewer__video" controls v-bind:poster="poster">
                <source type="video/mp4" v-bind:src="details.src"/>
            </video>
            <input type="range" v-model="speed" value="1" min="0.5" max="3" step="0.1"/>
            <span>{{speed}}x</span><button v-on:click="speed = 1">Reset Speed</button>
            <button v-on:click="fullscreen">Fullscreen</button>
        </div>
    </article>
</template>

<script>
export default {
    name: "presentation-viewer",
    data: () => ({
        details: null,
        speed: 1
    }),
    props: ["presentation", "sectionId"],
    computed: {
        title() {
            return this.presentation.title;   
        },
        loaded() {
            return this.details !== null;
        },
        poster() {
            return this.presentation.thumbnails[0];
        },
    },
    watch: {
        async presentation(p) {
            const uuid = p.uuid;
            this.details = null;
            this.speed = 1;

            const response = await fetch(`https://lecturecapture.qut.edu.au/ess/client/api/sections/${this.sectionId}/presentations/${uuid}/details.json`, {
                credentials: 'include'
            });

            const metadata = (await response.json()).presentation;

            const downloadResponse = await fetch(metadata.vodcast, {
                credentials: 'include'
            });

            const dp = new DOMParser();
            const downloadPage = dp.parseFromString(await downloadResponse.text(), "text/html");
            const src = downloadPage.querySelector("a[href$='download']").href;

            if (uuid === this.presentation.uuid) {
                this.details = {
                    src, metadata
                };
            }
        },
        speed(val) {
            const video = this.$refs.video;
            video.playbackRate = val;
        },
    },
    methods: {
        fullscreen() {
            this.$refs.video.requestFullscreen();
        }
    }
    
};
</script>

<style>
.echo720-viewer {
    flex: 60%;
}

.echo720-viewer__video {
    width: 100%;
}
</style>

