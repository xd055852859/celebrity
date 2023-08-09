import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/back",
    name: "back",
    component: () => import("@/views/home.vue"),
    redirect: "/back/set",
    children: [
      {
        path: "set",
        name: "set",
        component: () => import("@/views/set.vue"),
        children: [],
        props: true,
      },
      {
        path: "celebrity",
        name: "celebrity",
        component: () => import("@/views/celebrity.vue"),
        children: [],
        props: true,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    children: [],
  },
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/welcome.vue"),
    children: [],
  },
  {
    path: "/welcomeInfo",
    name: "welcomeInfo",
    component: () => import("@/views/welcomeInfo.vue"),
    children: [],
    props: true,
  },
  // {
  //   path: "/test",
  //   name: "test",
  //   component: () => import("@/views/test.vue"),
  //   children: [],
  //   props: true,
  // },
  {
    path: "/welcomeDetail/:detailKey",
    name: "welcomeDetail",
    component: () => import("@/views/welcomeDetail.vue"),
    children: [],
    props: true,
  },
  // {
  //   path: "/test",
  //   name: "/test",
  //   component: () => import("@/views/test.vue"),
  //   children: [],
  //   props: true,
  // },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
