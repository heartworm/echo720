import "regenerator-runtime/runtime";
import 'babel-polyfill';
import Vue from 'vue'
import Echo720App from './Echo720App.vue'
const env = process.env;
if (env.NODE_ENV !== "production") {
    Vue.config.devtools = true;
}

new Vue({
    el: '#echo720-app',
    render: h => h(Echo720App)
});