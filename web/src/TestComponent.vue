<template>
  <div>
    {{msg}}!!
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import ConfigService from "@/services/ConfigService";

@Component
export default class TestComponent extends Vue {

  msg: string = "hello from the frontend";
  
  @Inject()
  private configService!: ConfigService;

  // Hooks
  async mounted() {
      const configData = await this.configService.getConfigData();
      this.msg = configData.msg;
  }
}
</script>

<style lang="scss">
</style>
