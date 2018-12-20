import "@/polyfills/object-assign"; //polyfill
import "native-promise-only";
import Vue from 'vue';
import VueRouter from "vue-router";
import { rcdaApiClient } from '@/services/utils/RcdaApiClient';
import ChatService from "@/services/ChatService";
import AuthService from '@/services/AuthService';
import RootComponent from "@/components/RootComponent.vue";
import MyanmarDashboardService from '@/services/MyanmarDashboardService';
import RcdaWebLocalizerVuePlugin from "@/localization/RcdaWebLocalizerVuePlugin";

Vue.use(VueRouter);
Vue.use(RcdaWebLocalizerVuePlugin);

new Vue({
  el: "#app",
  render: h => h(RootComponent),
  provide: {
    'authService': new AuthService(rcdaApiClient),
    'chatService': new ChatService(rcdaApiClient),
    'myanmarDashboardService': new MyanmarDashboardService(rcdaApiClient),
    'rcdaLocalizerEvents': new Vue()
  }
});
