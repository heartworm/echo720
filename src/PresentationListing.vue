<template>
    <article class="echo720-listing">
        <dynamic-thumbnail class="echo720-listing__thumbnail" v-bind:hrefs="presentation.thumbnails"></dynamic-thumbnail>
        <header class="echo720-listing__text">
            <h1 class="echo720-listing__title">{{presentation.title}}</h1>
            <p class="echo720-listing__info">Length: {{time}}</p>
            <p class="echo720-listing__info">Week: {{presentation.week}}</p>
        </header>
    </article>
</template>
<script>
import DynamicThumbnail from './DynamicThumbnail.vue';
export default {
    name: 'presentation-listing',
    props: ["presentation"],
    computed: {
        time() {
            const ms = this.presentation.durationMS;
            const hours = Math.round(ms / 1000 / 60 / 60).toString();
            const minutes = Math.round(ms % (1000*60*60) / 1000 / 60).toString().padStart(2, '0');
            const seconds = Math.round(ms % (1000*60) / 1000).toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`
        },
    },
    components: {
        DynamicThumbnail
    }
}
</script>

<style>
    .echo720-listing__text {
        margin-left: 10px;
        text-align: left;
    }
    .echo720-listing__title, .echo720-listing__info {
        margin: 0;
        font-size: 1em;
    }
    .echo720-listing__thumbnail {
        height: 100px;
    }
    .echo720-listing {
        display: flex;
        align-items: center;
        margin: 10px 0;
        width: 100%;        
    }
</style>

