<template>
    <div class="echo720-viewer">
        <div v-if="presentation !== null" class="echo720-viewer__overlay" v-bind:class="{'echo720-viewer__overlay--active': !playing}">
            <div class="echo720-viewer__overlay-info">
                <p class="echo720-viewer__overlay-p"><a href="#" v-on:click="exit">Back</a></p>
                <p class="echo720-viewer__overlay-p">{{ title }}</p>
            </div>

        </div>
        <video v-if="presentation !== null" ref="video" class="echo720-viewer__video" v-bind:poster="poster" v-bind:src="src" v-bind:controls="loaded">
        </video>
    </div>
</template>

<script>
export default {
    name: "presentation-viewer",
    data: () => ({
        playing: false,
    }),
    props: ["presentation", "exit"],
    computed: {
        title() {
            return this.presentation.title();   
        },
        poster() {
            return this.presentation.thumbnails()[0];
        },
        src() {
            return this.presentation.videoSrc;
        },
        loaded() {
            return this.presentation.loaded;
        },
    },
    watch: {
        presentation(p) {
            p.addChangeListener(() => {
                this.$forceUpdate();
            });
            if (p.storage !== null) {
                p.storage.watched = true;
                const currentTime = p.storage.currentTime;
                if (currentTime !== undefined) {
                    this.$refs.video.currentTime = currentTime;
                }
            }
        }
    },
    mounted() {
        const vid = this.$refs.video;
        vid.addEventListener('playing', () => {this.playing = true;});
        vid.addEventListener('pause', () => {this.playing = false;});
        vid.addEventListener('timeupdate', () => {
            this.presentation.storage.currentTime = vid.currentTime;
            console.log(vid.currentTime);
        });
        vid.addEventListener('durationchange', () => {
            if (this.presentation.storage.currentTime !== undefined) { 
                console.log('set time');
                vid.currentTime = this.presentation.storage.currentTime;
            }
        });
    }
    
};
</script>

<style>
    .echo720-viewer {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
    } 

    .echo720-viewer__overlay  {       
        visibility: hidden;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        z-index: 1;
    }

    .echo720-viewer__overlay-info {
        color: white;
        margin: 10px;
        border: 3px solid #515151;
        background: rgba(62, 62, 62, 0.6);
        font-family: monospace;
        font-weight: bold;
        text-shadow: 2px 2px rgba(62,62,62,1);
        font-size: 2em;
        padding: 10px 20px;
    }

    .echo720-viewer__overlay-p {
        margin: 0.2em 0;
    }

    .echo720-viewer__overlay--active {
        visibility: visible;
        opacity: 1;
    }

    .echo720-viewer__video {
        position: absolute;
        height: 100%;
        background: black;
        width: 100%;
    }




</style>

