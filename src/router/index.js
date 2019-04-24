import Vue from "vue";
import Router from "vue-router";
import App from "@/App";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Error from "@/Error";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/error",
      name: "Error",
      component: Error
    },
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

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name
      ? next({
          name: from.name
        })
      : next("/error");
  } else {
    next(); //如果匹配到正确跳转
  }
});

export default router;
