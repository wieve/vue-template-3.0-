<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import api from "api";

export default {
  mounted() {
    let appDevice = "Android",
      appVersion = "6.5.5";
    api.getHealthReport(appDevice, appVersion).then(res => {
      console.log("res", res);
    });
    let data = {
      user_name: "admin",
      password: "adminadmin"
    };
    api.postLogin(data).then(res => {
      console.log("res", res);
    });
  }
};
</script>
