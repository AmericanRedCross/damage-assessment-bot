var _a;
import Vue from 'vue';
import TestComponent from './TestComponent.vue';
import ConfigService from '@/services/ConfigService';
Vue.config.devtools = true;
new Vue({
    el: '#app',
    render: function (h) { return h(TestComponent); },
    provide: (_a = {},
        _a['configService'] = new ConfigService(),
        _a)
});
//# sourceMappingURL=main.js.map