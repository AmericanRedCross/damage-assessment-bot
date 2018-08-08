import Vue from 'vue'
import TestComponent from './TestComponent.vue'
import ConfigService from '@/services/ConfigService';

Vue.config.devtools = true

new Vue({
  el: '#app',
  render: h => h(TestComponent),
  provide: {
    ['configService']: new ConfigService()
  }
})
