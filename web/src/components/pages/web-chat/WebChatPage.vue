<template>
    <div>
      <div v-once ref="webChatRoot" class="webChatRoot" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { renderWebChat, createDirectLine, createStyleSet } from "botframework-webchat/lib";
import { Component, Inject } from "vue-property-decorator";
import ChatService from "@/services/ChatService";

@Component
export default class WebChatPage extends Vue {

  @Inject()
  private chatService!: ChatService;

  // hooks
  async mounted() {
    let token = await this.chatService.getWebChatToken();
    let directLine = createDirectLine({ token: token });
    
    const styleSet = createStyleSet({
      // TODO: set these accurately. leaving this in to demonstrate the feature.
      bubbleBackground: 'rgba(0, 0, 255, .1)',
      bubbleFromUserBackground: 'rgba(0, 255, 0, .1)'
    });

    // After generated, you can modify the CSS rules
    styleSet.textContent = { ...styleSet.textContent,
      // fontFamily: '\'Comic Sans MS\', \'Arial\', sans-serif',
      // fontWeight: 'bold'
    };

    renderWebChat({ 
      directLine: directLine,
      styleSet: styleSet
    }, this.$refs.webChatRoot);
  }
}
</script>

<style>
div.webChatRoot > div {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>