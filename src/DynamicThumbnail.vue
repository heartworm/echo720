<template>
    <img class="echo720-thumbnail"  v-on:mouseover="startScrolling" v-on:mouseout="stopScrolling" v-bind:src="hrefs[currentIndex]" />
</template>

<script>
export default {
    name: "dynamic-thumbnail",
    data: () => ({
        currentIndex: 0,
        intervalHandle: null,
    }),
    props: ["hrefs", "delay"],
    methods: {
        startScrolling() {
            this.intervalHandle = setInterval(()=> {
                this.currentIndex = (this.currentIndex + 1) % this.hrefs.length;
            }, this.delay || 500);
        },
        stopScrolling() {
            clearInterval(this.intervalHandle);
            this.currentIndex = 0;
        }
    },
};
</script>

<style>
</style>
