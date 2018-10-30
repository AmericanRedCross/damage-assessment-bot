import Vue from 'vue';
import VueRouter from "vue-router";
import { rcdaApiClient } from '@/services/utils/RcdaApiClient';
import ChatService from "@/services/ChatService";
import AuthService from '@/services/AuthService';
import RootComponent from "@/components/RootComponent.vue";

Vue.use(VueRouter);

new Vue({
  el: "#app",
  render: h => h(RootComponent),
  provide: {
    ['authService']: new AuthService(rcdaApiClient),
    ['chatService']: new ChatService(rcdaApiClient)
  }
});
