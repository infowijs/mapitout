<template>
  <div class="tabs">
    <div class="header"></div>
    <div class="body"></div>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.tabs {
  min-width: 340px;
}

.header {
  background: $greyscale-0;
  padding: 10px 14px 0 14px;
  content: " ";
}
.body {
  content: " ";
}
</style>
