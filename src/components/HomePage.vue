<template>
  <div class="home-page">
    <!-- วิดีโอพื้นหลัง -->
    <video autoplay muted loop class="background-video">
      <source :src="videoSrc" type="video/mp4">
    </video>

    <!-- เพลงพื้นหลัง -->
    <audio ref="backgroundMusic" loop>
      <source src="@/assets/background-music.mp3" type="audio/mpeg">
    </audio>

    <!-- ควบคุมเสียง -->
    <div class="music-controls">
      <button @click="toggleMusic" class="music-button">
        <i :class="musicIcon"></i>
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        v-model="volume" 
        @input="changeVolume"
        class="volume-slider"
      >
    </div>

    <div class="content-container">
      <!-- ส่วนหัวข้อหลัก -->
      <div class="text-container">
        <h1 class="main-title">นายภาณุพงศ์ อัศวภูมิ</h1>
        <div class="divider"></div>
        <h2 class="sub-title">รหัส 6630250354 สาขาวิทยาการคอมพิวเตอร์</h2>
      </div>
      
      <!-- พื้นที่สำหรับรูปภาพ 2 รูป -->
      <div class="image-gallery">
        <div class="image-wrapper floating-animation">
          <img :src="imageSrc1" alt="รูปภาพที่ 1" class="profile-image">
        </div>
        <div class="image-wrapper floating-animation-delay">
          <img :src="imageSrc2" alt="รูปภาพที่ 2" class="profile-image">
        </div>
      </div>

      <!-- เมนู -->
      <div class="menu">
        <router-link :to="{ name: 'AboutSchools' }" class="menu-item">
      โรงเรียนเดิม
    </router-link>
    <router-link :to="{ name: 'CourseManagement' }" class="menu-item">
  รายละเอียดการเรียน
</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import backgroundVideo from '@/assets/background-video.mp4';
import yourImage1 from '@/assets/profile.jpg';
import yourImage2 from '@/assets/profile2.jpg';

export default {
  name: 'HomePage',
  data() {
    return {
      videoSrc: backgroundVideo,
      imageSrc1: yourImage1,
      imageSrc2: yourImage2,
      isPlaying: false,
      volume: 0.5
    }
  },
  computed: {
    musicIcon() {
      return this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  },
  mounted() {
    // ตั้งค่าระดับเสียงเริ่มต้น
    this.$refs.backgroundMusic.volume = this.volume;
    
    // พยายามเล่นเพลงอัตโนมัติ
    this.$refs.backgroundMusic.play()
      .then(() => this.isPlaying = true)
      .catch(e => console.log("Autoplay was prevented:", e));
    
    // เพิ่ม Font Awesome โดยตรง
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  },
  methods: {
    toggleMusic() {
      if (this.isPlaying) {
        this.$refs.backgroundMusic.pause();
      } else {
        this.$refs.backgroundMusic.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    changeVolume() {
      this.$refs.backgroundMusic.volume = this.volume;
    }
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans Thai', sans-serif;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.9) contrast(1.1);
}

.content-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  z-index: 2;
  color: white;
  text-align: center;
}

.text-container {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 30px 50px;
  border-radius: 20px;
  margin-bottom: 40px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.main-title {
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 15px;
  color: #ffffff;
  text-shadow: 
    2px 2px 6px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(255, 255, 255, 0.4);
}

.divider {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, 
              transparent, 
              rgba(255,255,255,0.9), 
              transparent);
  margin: 25px auto;
}

.sub-title {
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
  color: #f8f8f8;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
}

.image-gallery {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin: 40px 0;
  width: 100%;
  max-width: 850px;
}

/* เอฟเฟกต์การขยับรูปภาพ */
@keyframes floating {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(1.5deg);
  }
}

.image-wrapper {
  width: 240px;
  height: 240px;
  border-radius: 18px;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease;
  animation: floating 4s ease-in-out infinite;
  transform-origin: center bottom;
}

.floating-animation-delay {
  animation-delay: 2s;
}

.image-wrapper:hover {
  animation-play-state: paused;
  transform: scale(1.08) translateY(-8px) rotate(2deg) !important;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.95);
  z-index: 3;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.image-wrapper:hover .profile-image {
  transform: scale(1.05);
}

.menu {
  display: flex;
  gap: 30px;
  margin-top: 50px;
}

.menu-item {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 500;
  padding: 14px 35px;
  border-radius: 35px;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

/* เพิ่มสไตล์สำหรับ Music Controls */
.music-controls {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.music-controls:hover {
  background: rgba(0, 0, 0, 0.6);
}

.music-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.music-button:hover {
  transform: scale(1.1);
  color: #4fc3f7;
}

.volume-slider {
  -webkit-appearance: none; /* จำเป็นสำหรับ Safari */
  appearance: none; /* มาตรฐานใหม่ */
  width: 100px;
  height: 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.volume-slider:hover {
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #4fc3f7;
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .text-container {
    padding: 25px;
    width: 90%;
    backdrop-filter: blur(6px);
  }
  
  .main-title {
    font-size: 2.4rem;
  }
  
  .sub-title {
    font-size: 1.3rem;
  }
  
  .image-gallery {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  .image-wrapper {
    width: 220px;
    height: 220px;
    animation: floating 5s ease-in-out infinite;
  }
  
  .floating-animation-delay {
    animation-delay: 2.5s;
  }
  
  .menu {
    flex-direction: column;
    gap: 18px;
    width: 100%;
    margin-top: 40px;
  }
  
  .menu-item {
    width: 90%;
    margin: 0 auto;
    padding: 12px;
    font-size: 1.2rem;
  }

  .music-controls {
    bottom: 20px;
    right: 20px;
    padding: 8px 12px;
  }
  
  .volume-slider {
    width: 80px;
  }
}
</style>