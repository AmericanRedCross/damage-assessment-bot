var _a;
import Vue from 'vue';
import VueRouter from "vue-router";
import ConfigService from '@/services/ConfigService';
import ChatService from "@/services/ChatService";
import AuthService from '@/services/AuthService';
import RootComponent from "@/components/RootComponent.vue";
Vue.use(VueRouter);
new Vue({
    el: "#app",
    render: function (h) { return h(RootComponent); },
    provide: (_a = {},
        _a['configService'] = new ConfigService(),
        _a['authService'] = new AuthService(),
        _a['chatService'] = new ChatService(),
        _a)
});
//# sourceMappingURL=main.js.map