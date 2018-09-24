import Vue from 'vue';
import VueRouter from "vue-router";
import ConfigService from '@/services/ConfigService';
import ChatService from "@/services/ChatService";
import AuthService from '@/services/AuthService';
import RootComponent from "@/components/RootComponent.vue";

Vue.use(VueRouter);

new Vue({
  el: "#app",
  render: h => h(RootComponent),
  provide: {
    ['configService']: new ConfigService(),
    ['authService']: new AuthService(),
    ['chatService']: new ChatService()
  }
})
