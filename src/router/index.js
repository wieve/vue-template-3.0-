import Vue from "vue";
import Router from "vue-router";
import App from "@/App";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "App",
      component: App
    },
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
