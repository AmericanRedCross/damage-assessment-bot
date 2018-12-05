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
    let directLine = createDirectLine({ 
      token: token
    });
    
    const styleSet = createStyleSet({
      bubbleTextColor: 'Black',
      bubbleBackground: 'rgba(215, 215, 216, 1)',
      bubbleFromUserBackground: 'rgba(0, 0, 0, 1)',
      bubbleFromUserTextColor: "White"
    });

    // After generated, you can modify the CSS rules
    // styleSet.textContent = { ...styleSet.textContent,
    //   // fontFamily: '\'Comic Sans MS\', \'Arial\', sans-serif',
    //   // fontWeight: 'bold'
    // };

    renderWebChat({ 
      directLine: directLine,
      styleSet: styleSet
    }, this.$refs.webChatRoot);
  }
}
</script>

<template>
<div class="webchat-main-panel">
  <div v-once ref="webChatRoot" class="webchat-conversation-panel" />
</div>
</template>

<style>

.webchat-main-panel {
  background-color: #6D6E70;
}

.webchat-conversation-panel {
  width: 530px;
  background-color: white;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  vertical-align: bottom;
}

.webchat-conversation-panel > div {
  height: 100%;
}

</style>