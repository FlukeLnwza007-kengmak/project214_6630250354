<template>
  <div class="about-page">
    <!-- วิดีโอพื้นหลัง -->
    <video autoplay muted loop class="background-video">
      <source :src="videoSrc" type="video/mp4">
    </video>

    <!-- เพลงพื้นหลัง -->
    <audio ref="backgroundMusic" loop>
      <source :src="musicSrc" type="audio/mpeg">
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

    <!-- เนื้อหาหลัก -->
    <div class="content-container">
      <h1 class="fade-in">โรงเรียนเดิมของฉัน</h1>
      
      <div class="schools">
        <div class="school" v-for="(school, index) in schools" :key="index">
          <img :src="school.image" :alt="school.name" class="school-img">
          <h2 class="glow-text">{{ school.name }}</h2>
          <p>{{ school.description }}</p>
        </div>
      </div>

      <router-link to="/" class="back-button">กลับหน้าหลัก</router-link>
    </div>
  </div>
</template>

<script>
import school1 from '@/assets/school1.jpg'
import school2 from '@/assets/school2.jpg'
import school3 from '@/assets/school3.jpg'
import backgroundVideo from '@/assets/background-video.mp4'
import backgroundMusic from '@/assets/background-music.mp3'

export default {
  name: 'AboutSchools',
  data() {
    return {
      videoSrc: backgroundVideo,
      musicSrc: backgroundMusic,
      schools: [
        { name: 'โรงเรียนบ้านนาทุ่ง', description: 'ปีการศึกษา 2562-2564', image: school1 },
        { name: 'โรงเรียนพุทธิรังสีพิบูล', description: 'ปีการศึกษา 2559-2561', image: school2 },
        { name: 'โรงเรียนรวมิทราชินูทิศเตรียมอุดมศึกษาพัฒนาการ', description: 'ปีการศึกษา 2551-2558', image: school3 }
      ],
      isPlaying: false,
      volume: 0.5
    }
  },
  computed: {
    musicIcon() {
      return this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute'
    }
  },
  mounted() {
    this.$refs.backgroundMusic.volume = this.volume
    this.$refs.backgroundMusic.play()
      .then(() => this.isPlaying = true)
      .catch(e => console.log("Autoplay was prevented:", e))
  },
  methods: {
    toggleMusic() {
      if (this.isPlaying) {
        this.$refs.backgroundMusic.pause()
      } else {
        this.$refs.backgroundMusic.play()
      }
      this.isPlaying = !this.isPlaying
    },
    changeVolume() {
      this.$refs.backgroundMusic.volume = this.volume
    }
  }
}
</script>

<style scoped>
.about-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
  z-index: 1;
}

.content-container {
  position: relative;
  z-index: 2;
  padding: 20px;
  color: white;
  text-align: center;
}

.fade-in {
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.schools {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin: 40px 0;
}

.school {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 15px;
  width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.school:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.school-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.school:hover .school-img {
  transform: scale(1.1);
}

.glow-text {
  text-shadow: 0 0 10px #fff, 0 0 20px #ff6b6b, 0 0 30px #ff4757;
}

.back-button {
  margin-top: 40px;
  padding: 12px 30px;
  background: rgba(255,255,255,0.2);
  color: white;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255,255,255,0.4);
  transform: translateY(-3px);
}
</style>
