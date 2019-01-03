import "@/polyfills/object-assign"; //polyfill
import "native-promise-only";
import Vue from 'vue';
import VueRouter from "vue-router";
import { rcdaApiClient } from '@/services/utils/RcdaApiClient';
import RcdaChatClient from "@/services/utils/RcdaChatClient";
import ChatService from "@/services/ChatService";
import AuthService from '@/services/AuthService';
import RootComponent from "@/components/RootComponent.vue";
import MyanmarDashboardService from '@/services/MyanmarDashboardService';
import RcdaWebLocalizerVuePlugin from "@/localization/RcdaWebLocalizerVuePlugin";
import RcdaStorageClient from "@/services/utils/RcdaStorageClient";

Vue.use(VueRouter);
Vue.use(RcdaWebLocalizerVuePlugin);

const rcdaStorageClient = new RcdaStorageClient();
const rcdaChatClient = new RcdaChatClient(rcdaApiClient, rcdaStorageClient);

new Vue({
  el: "#app",
  render: h => h(RootComponent),
  provide: {
    'authService': new AuthService(rcdaApiClient, rcdaStorageClient),
    'chatService': new ChatService(rcdaChatClient),
    'myanmarDashboardService': new MyanmarDashboardService(rcdaApiClient, rcdaStorageClient),
    'rcdaLocalizerEvents': new Vue()
  }
});
