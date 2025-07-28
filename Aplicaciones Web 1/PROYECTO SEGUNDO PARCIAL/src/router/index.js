import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import AdminPanel from "../views/AdminPanel.vue"
import UserPanel from "../views/UserPanel.vue"
import UserManagement from "../views/UserManagement.vue"
import ParkingManagement from "../views/ParkingManagement.vue"
import ExitManagement from "../views/ExitManagement.vue"
import SpaceReservation from "../views/SpaceReservation.vue"
import MyReservations from "../views/MyReservations.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: AdminPanel,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/user",
    name: "UserPanel",
    component: UserPanel,
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/admin/users",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/parking",
    name: "ParkingManagement",
    component: ParkingManagement,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/exits",
    name: "ExitManagement",
    component: ExitManagement,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/user/reserve",
    name: "SpaceReservation",
    component: SpaceReservation,
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/user/reservations",
    name: "MyReservations",
    component: MyReservations,
    meta: { requiresAuth: true, role: "user" },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const userRole = localStorage.getItem("userRole")

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login")
  } else if (to.meta.role && to.meta.role !== userRole) {
    next("/")
  } else {
    next()
  }
})

export default router
