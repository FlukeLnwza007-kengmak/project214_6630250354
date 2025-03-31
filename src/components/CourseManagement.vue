<template>
  <div class="course-page">
    <!-- Background Video -->
    <video autoplay muted loop class="background-video">
      <source src="@/assets/background-video.mp4" type="video/mp4">
    </video>

    <!-- Background Music -->
    <audio ref="backgroundMusic" loop>
      <source src="@/assets/background-music.mp3" type="audio/mpeg">
    </audio>

    <!-- Music Controls -->
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

    <!-- Main Content -->
    <div class="content-container">
      <div class="course-management glass-card">
        <h1 class="mb-4 title-text">Course Management</h1>
        
        <div class="card mb-4 glass-card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="mb-0">My Courses</h2>
            <button @click="showAddCourseForm = true" class="btn btn-add" v-if="!showAddCourseForm">
              <i class="fas fa-plus"></i> Add Course
            </button>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.id" class="course-row">
                    <td>{{ course.code }}</td>
                    <td>{{ course.name }}</td>
                    <td>{{ course.credits }}</td>
                    <td>
                      <span class="grade-badge" :class="'grade-' + course.grade.replace('+', 'plus')">
                        {{ course.grade }}
                      </span>
                    </td>
                    <td>
                      <button @click="editCourse(course)" class="btn btn-sm btn-edit me-2">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button @click="deleteCourse(course.id)" class="btn btn-sm btn-delete">
                        <i class="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card glass-card" v-if="showAddCourseForm">
          <div class="card-header">
            <h2>{{ editingCourse ? 'Edit Course' : 'Add New Course' }}</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveCourse">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Course Code</label>
                  <input type="text" class="form-control" v-model="courseForm.code" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Course Name</label>
                  <input type="text" class="form-control" v-model="courseForm.name" required>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Credits</label>
                  <input type="number" class="form-control" v-model.number="courseForm.credits" required min="1">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Grade</label>
                  <select class="form-select" v-model="courseForm.grade" required>
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-save me-2" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm" role="status"></span>
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button type="button" @click="cancelCourseForm" class="btn btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backgroundVideo from '@/assets/background-video.mp4';
import backgroundMusic from '@/assets/background-music.mp3';

export default {
  data() {
    return {
      courses: [],
      loading: false,
      error: null,
      saving: false,
      showAddCourseForm: false,
      editingCourse: null,
      courseForm: {
        id: null,
        code: "",
        name: "",
        credits: "",
        grade: ""
      },
      // Music controls
      isPlaying: false,
      volume: 0.5
    }
  },
  computed: {
    musicIcon() {
      return this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  },
  created() {
    this.fetchCourses();
  },
  mounted() {
    this.$refs.backgroundMusic.volume = this.volume;
    // Try to autoplay music
    this.$refs.backgroundMusic.play()
      .then(() => this.isPlaying = true)
      .catch(e => console.log("Autoplay prevented:", e));
    
    // Load Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  },
  methods: {
    async fetchCourses() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('http://localhost:3000/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        this.courses = await response.json();
      } catch (error) {
        console.error('Error fetching courses:', error);
        this.error = 'Failed to load courses. Please check if json-server is running.';
      } finally {
        this.loading = false;
      }
    },
    editCourse(course) {
      this.editingCourse = course;
      this.courseForm = { ...course };
      this.showAddCourseForm = true;
    },
    cancelCourseForm() {
      this.showAddCourseForm = false;
      this.editingCourse = null;
      this.resetCourseForm();
    },
    resetCourseForm() {
      this.courseForm = {
        id: null,
        code: "",
        name: "",
        credits: "",
        grade: ""
      };
    },
    async saveCourse() {
      this.saving = true;
      try {
        if (this.editingCourse) {
          // Update existing course
          const response = await fetch(`http://localhost:3000/courses/${this.courseForm.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.courseForm)
          });
          
          if (!response.ok) {
            throw new Error('Failed to update course');
          }
        } else {
          // Add new course
          const { id, ...newCourse } = this.courseForm;
          const response = await fetch('http://localhost:3000/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCourse)
          });
          
          if (!response.ok) {
            throw new Error('Failed to add course');
          }
        }
        
        await this.fetchCourses();
        this.cancelCourseForm();
      } catch (error) {
        console.error('Error saving course:', error);
        alert('Failed to save course. Please check console for details.');
      } finally {
        this.saving = false;
      }
    },
    async deleteCourse(courseId) {
      if (!confirm('Are you sure you want to delete this course?')) return;
      
      try {
        const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete course');
        }
        await this.fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please check console for details.');
      }
    },
    // Music controls
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
.course-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.7) contrast(1.1);
}

.content-container {
  position: relative;
  z-index: 2;
  padding: 20px;
}

.course-management {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  background: rgba(0, 0, 0, 0.3) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.title-text {
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-weight: 600;
  letter-spacing: 1px;
}

.table {
  color: white;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.table th {
  background: rgba(0, 0, 0, 0.3);
  border: none;
  font-weight: 500;
}

.table td {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  vertical-align: middle;
}

.course-row:hover td {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.01);
}

.grade-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.grade-A { background: rgba(0, 200, 83, 0.8); }
.grade-Bplus { background: rgba(100, 221, 23, 0.8); }
.grade-B { background: rgba(255, 171, 0, 0.8); }
.grade-Cplus { background: rgba(255, 145, 0, 0.8); }
.grade-C { background: rgba(255, 109, 0, 0.8); }
.grade-Dplus { background: rgba(255, 82, 82, 0.8); }
.grade-D { background: rgba(255, 61, 0, 0.8); }
.grade-F { background: rgba(213, 0, 0, 0.8); }

.btn-add {
  background: rgba(76, 175, 80, 0.8);
  color: white;
  border: none;
  transition: all 0.3s;
}

.btn-add:hover {
  background: rgba(76, 175, 80, 1);
  transform: translateY(-2px);
}

.btn-edit {
  background: rgba(33, 150, 243, 0.7);
  color: white;
  border: none;
}

.btn-edit:hover {
  background: rgba(33, 150, 243, 1);
}

.btn-delete {
  background: rgba(244, 67, 54, 0.7);
  color: white;
  border: none;
}

.btn-delete:hover {
  background: rgba(244, 67, 54, 1);
}

.btn-save {
  background: rgba(76, 175, 80, 0.8);
  color: white;
  border: none;
  min-width: 100px;
}

.btn-save:hover {
  background: rgba(76, 175, 80, 1);
}

.btn-cancel {
  background: rgba(158, 158, 158, 0.7);
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: rgba(158, 158, 158, 1);
}

.form-control, .form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.form-control:focus, .form-select:focus {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.1);
}

.form-label {
  color: white;
  font-weight: 500;
}

.alert-danger {
  background: rgba(244, 67, 54, 0.8);
  color: white;
  border: none;
}

/* Music Controls */
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
  -webkit-appearance: none;
  appearance: none;
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

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .course-management {
    padding: 15px;
  }
  
  .table-responsive {
    overflow-x: auto;
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