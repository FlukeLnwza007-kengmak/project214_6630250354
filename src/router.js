import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import AboutSchools from '@/components/AboutSchools.vue'
import CourseManagement from '@/components/CourseManagement.vue' // ตรวจสอบว่ามีการ import

const routes = [
  { 
    path: '/', 
    component: HomePage,
    name: 'Home'
  },
  { 
    path: '/about-schools', 
    component: AboutSchools,
    name: 'AboutSchools'
  },
  { 
    path: '/course-management', 
    component: CourseManagement,
    name: 'CourseManagement' // ชื่อนี้ต้องตรงกับที่ใช้ใน router-link
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
})

export default router