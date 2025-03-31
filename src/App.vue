<template>
  <div class="app-container">
    <!-- วีดีโอพื้นหลัง -->
    <video 
      class="background-video"
      autoplay
      muted
      loop
      playsinline
    >
      <source src="@/assets/videos/background.mp4" type="video/mp4">
      <!-- Fallback ถ้าเบราว์เซอร์ไม่รองรับ -->
      <img src="@/assets/images/background-fallback.jpg" alt="พื้นหลัง">
    </video>
    
    <!-- เนื้อหาหน้าเว็บ -->
    <div class="content-overlay">
      <router-view /> <!-- หรือใส่เนื้อหาของคุณตรงนี้ -->
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0; /* ปรับความโปร่งใสตามต้องการ */
}

.content-overlay {
  position: relative;
  background-color: rgba(255, 255, 255, 0.85); /* ทำให้เนื้อหาอ่านง่าย */
  min-height: 100vh;
}
</style>