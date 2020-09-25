import Vue from "vue";
import VueRouter from "vue-router";
import Contact from "../views/contact/Contact.vue";
import Complete from "../views/contact/Complete.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Contact",
    component: Contact
  },
  {
    path: "/complete",
    name: "Complete",
    component: Complete
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
