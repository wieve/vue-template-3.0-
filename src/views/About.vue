<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import config from 'config';

export default {
  mounted() {
    console.log("config", config);
  }
};
</script>
