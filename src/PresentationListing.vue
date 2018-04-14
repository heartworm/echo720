<template>
    <article class="echo720-listing" v-bind:class="{'echo720-listing--featured': lastWatched}">
        <!-- <dynamic-thumbnail class="echo720-listing__thumbnail" v-bind:hrefs="presentation.thumbnails"></dynamic-thumbnail> -->
        <figure class="echo720-listing__thumbnail">
            <img class="echo720-listing__img" v-bind:src="presentation.thumbnails()[0]" /> 
            <div class="echo720-listing__controls">
                <a class="echo720-listing__control" v-if="!unwatched" v-on:click="restart" href="#"><font-awesome-icon icon="undo" /></a>
                <a class="echo720-listing__control" v-on:click="play" href="#"><font-awesome-icon icon="play" /></a>
            </div>
            <span class="echo720-listing__progress-bar" v-bind:style="{'width': completedPercentage}" ></span>
            <span class="echo720-listing__thumbnail-info echo720-listing__thumbnail-info--right">{{duration}}</span>
            <span v-if="!unwatched" class="echo720-listing__thumbnail-info echo720-listing__thumbnail-info--left">
                <span v-if="lastWatched">Recent </span><font-awesome-icon v-else icon="eye" />
            </span>
        </figure>
        <header class="echo720-listing__text">
            <h1 class="echo720-listing__title">{{presentation.title()}}</h1>
            <p class="echo720-listing__info">Recorded: {{date}}</p>
            <p class="echo720-listing__info">Week: {{presentation.week()}}</p>
        </header>
    </article>
</template>
<script>
import DynamicThumbnail from './DynamicThumbnail.vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faEye } from '@fortawesome/fontawesome-free-solid';
export default {
    name: 'presentation-listing',
    props: ["presentation", "choose", "lastWatched"],
    components: {
        DynamicThumbnail,
        FontAwesomeIcon
    },
    data: () => ({
        icons: {
            eye: faEye,
        }
    }),
    computed: {
        duration() {
            const d = this.presentation.duration();
            const hours = Math.floor(d / (60 * 60)).toString();
            const minutes = Math.floor(d % (60 * 60) / (60)).toString().padStart(2, '0');
            const seconds = Math.round(d % (60)).toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        date() {
            return this.presentation.date().toLocaleString();
        },
        completedPercentage() {
            const total = this.presentation.duration();
            const s = this.presentation.storage;
            const completed = s.completed ? 100 : s.currentTime ? s.currentTime : 0;
            return `${Math.min(100, completed/total * 100)}%`;
        },
        unwatched() {
            return !(this.presentation.storage.currentTime || this.presentation.storage.completed);
        },
    },
    methods: {
        restart() {
            this.presentation.resetStorage();
        },
        play() {
            this.presentation.setLastWatched();
            this.choose(this.presentation);
        }
    },
    mounted() {
        this.presentation.addChangeListener(()=> {
            this.$forceUpdate();
        });
    }
}
</script>

<style>
    .echo720-listing__text {
        margin: 0 10px;
        text-align: left;
        flex-grow: 1;
    }
    .echo720-listing__title, .echo720-listing__info {
        margin: 0;
        font-size: 1em;
    }
    .echo720-listing__thumbnail {
        height: 100%;
        width: 200px;
        margin: 0;
        flex-grow: 0;
        position: relative;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 200px;
    }
    .echo720-listing__img {
        max-width: 100%;
        max-height: 100%;
    }
    .echo720-listing__thumbnail-info {
        background: rgba(0,0,0,0.5);
        z-index: 1;
        position:absolute;
        top: 0;
        padding:3px;
        color: #fff;
    }
    .echo720-listing__thumbnail-info--right {
        right: 0;
    }
    .echo720-listing__thumbnail-info--left {
        left: 0;
    }
    .echo720-listing__progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 10%;
        background: rgba(255,0,0,0.5);
        width: 0;
    }
    .echo720-listing__controls {
        position: absolute;
        padding: 10px;
        background: rgba(0,0,0,0.5);
    }
    .echo720-listing__control, .echo720-listing__control:visited {
        color:white;
        margin: 0 5px;
    }
    .echo720-listing {
        display: flex;
        align-items: center;
        margin: 10px 0;    
        height: 100px; 
        flex-basis: 50%;
        flex-grow: 1;
    }
    .echo720-listing--featured {
        order: -1;
    }
</style>

