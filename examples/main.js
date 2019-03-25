import Vue from 'vue';
import App from './App.vue';
import uploader from '../packages/uploader/index';

Vue.config.productionTip = false;
Vue.use(uploader);

new Vue({
    render: h => h(App),
}).$mount('#app');
