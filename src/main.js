import Vue from 'vue'
import Echo720App from './Echo720App.vue'
import 'babel-polyfill';
new Vue({
    el: '#echo720-app',
    render: h => h(Echo720App)
});