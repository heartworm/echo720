<template>
    <div class="echo720-viewer" v-on:mousemove="updateLastMoved" v-bind:class="{'echo720-viewer--cursor-hidden': !overlayActive}">
        <div v-if="presentation !== null" class="echo720-viewer__overlay" v-bind:class="{'echo720-viewer__overlay--active': overlayActive}">
            <div class="echo720-viewer__overlay-info">
                <p class="echo720-viewer__overlay-p">
                    <a href="#" class="echo720-viewer__overlay-a" v-on:click="exit">Back</a>
                    <a href="#" v-if="loaded" class="echo720-viewer__overlay-a" v-on:click="startOver">Start Over</a>
                    <a href="#" v-if="loaded" class="echo720-viewer__overlay-a" v-on:click="jumpBack">-30s</a>
                </p>
                <p class="echo720-viewer__overlay-p">{{ title }}</p>
                <p v-if="loaded" class="echo720-viewer__overlay-p">
                    Speed: {{speed.toFixed(1)}}x (<a href="#" class="echo720-viewer__overlay-a" v-on:click="increaseSpeed">+</a>/<a href="#" class="echo720-viewer__overlay-a" v-on:click="decreaseSpeed">-</a>)
                </p>
                <p v-show="!loaded" class="echo720-viewer__overlay-p">
                    Loading...
                </p>
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
        playReady: false,
        menuVisible: false,
        lastMoved: null,
        speed: 1
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
            return this.presentation.loaded && this.playReady;
        },
        overlayActive() {
            return !this.playing || this.lastMoved !== null;
        },
    },
    watch: {
        presentation(p) {
            this.playing = false;
            this.playReady = false;
            this.speed = 1;
            p.addChangeListener(() => {
                this.$forceUpdate();
            });
            if (p.storage !== null) {
                p.storage.watched = true;
            }
        },
        speed(s) {
            this.$refs.video.playbackRate = s;
        }
    },
    mounted() {
        const vid = this.$refs.video;
        vid.addEventListener('playing', () => {this.playing = true;});
        vid.addEventListener('pause', () => {this.playing = false;});
        vid.addEventListener('timeupdate', () => {
            if (this.playing) {
                this.presentation.setCurrentTime(vid.currentTime);
            }
        });
        vid.addEventListener('ended', () => {
            this.presentation.setEnded();
        });
        vid.addEventListener('loadedmetadata', () => {
            this.playReady = true;
            if (!this.presentation.unwatched()) { 
                vid.currentTime = this.presentation.currentTime();
            }
        });
    },
    methods: {
        startOver() {
            this.$refs.video.currentTime = 0;
            this.$refs.video.play();
        },
        jumpBack() {
            this.$refs.video.currentTime = Math.max(this.$refs.video.currentTime - 30, 0);
        },
        updateLastMoved(ev) {
            this.lastMoved = ev;
            window.setTimeout(() => {
                if (this.lastMoved === ev) {
                    this.lastMoved = null;
                }
            }, 5000);
        },
        incrementSpeed(inc) {
            this.speed = Math.max(0.5, Math.min(3, this.speed + inc));
        },
        increaseSpeed() {
            this.incrementSpeed(0.1);
        },
        decreaseSpeed() {
            this.incrementSpeed(-0.1);
        }
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

    .echo720-viewer__overlay-a, .echo720-viewer__overlay-a:visited {
        color: white;
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


    .echo720-viewer--cursor-hidden {
        cursor: none;
    }



</style>

