import Vue from 'vue';
import App from './App.vue';
import uploader from './components/uploader';

Vue.config.productionTip = false;
Vue.component('uploader', uploader);

new Vue({
    render: h => h(App),
}).$mount('#app');
