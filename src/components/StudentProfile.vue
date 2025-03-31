<template>
  <div class="student-profile">
    <h1 class="mb-4">Student Profile</h1>
    
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h2>Personal Information</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateProfile">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">First Name</label>
              <input type="text" class="form-control" v-model="student.firstName">
            </div>
            <div class="col-md-6">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-control" v-model="student.lastName">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Student ID</label>
              <input type="text" class="form-control" v-model="student.studentId">
            </div>
            <div class="col-md-6">
              <label class="form-label">Department</label>
              <input type="text" class="form-control" v-model="student.department">
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-primary text-white">
        <h2>School History</h2>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4" v-for="school in student.schools" :key="school.id">
            <div class="card mb-3">
              <img :src="school.logo" class="card-img-top" alt="School Logo" style="height: 150px; object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title">{{ school.name }}</h5>
                <p class="card-text">Years: {{ school.years }}</p>
                <button @click="editSchool(school)" class="btn btn-sm btn-outline-primary me-2">Edit</button>
                <button @click="deleteSchool(school.id)" class="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <button @click="showAddSchoolForm = true" class="btn btn-success mt-3" v-if="!showAddSchoolForm">
          Add School
        </button>

        <div class="mt-4" v-if="showAddSchoolForm">
          <h3>{{ editingSchool ? 'Edit School' : 'Add New School' }}</h3>
          <form @submit.prevent="saveSchool">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">School Name</label>
                <input type="text" class="form-control" v-model="schoolForm.name" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Years Attended</label>
                <input type="text" class="form-control" v-model="schoolForm.years" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">School Logo URL</label>
              <input type="text" class="form-control" v-model="schoolForm.logo" required>
              <small class="text-muted">You can upload images to /assets/ folder and use the path here</small>
            </div>
            <button type="submit" class="btn btn-primary me-2">Save</button>
            <button type="button" @click="cancelSchoolForm" class="btn btn-secondary">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      student: {
        id: 1,
        firstName: "ชื่อ",
        lastName: "นามสกุล",
        studentId: "รหัสนักศึกษา",
        department: "สาขา",
        schools: []
      },
      showAddSchoolForm: false,
      editingSchool: null,
      schoolForm: {
        id: null,
        name: "",
        logo: "",
        years: ""
      }
    }
  },
  created() {
    this.fetchStudentData();
  },
  methods: {
    async fetchStudentData() {
      try {
        const response = await fetch('http://localhost:3000/student');
        this.student = await response.json();
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    },
    async updateProfile() {
      try {
        await fetch(`http://localhost:3000/student`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.student)
        });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      }
    },
    editSchool(school) {
      this.editingSchool = school;
      this.schoolForm = { ...school };
      this.showAddSchoolForm = true;
    },
    cancelSchoolForm() {
      this.showAddSchoolForm = false;
      this.editingSchool = null;
      this.schoolForm = {
        id: null,
        name: "",
        logo: "",
        years: ""
      };
    },
    async saveSchool() {
      try {
        let updatedSchools;
        
        if (this.editingSchool) {
          // Update existing school
          updatedSchools = this.student.schools.map(school => 
            school.id === this.schoolForm.id ? this.schoolForm : school
          );
        } else {
          // Add new school
          const newSchool = {
            ...this.schoolForm,
            id: Math.max(...this.student.schools.map(s => s.id), 0) + 1
          };
          updatedSchools = [...this.student.schools, newSchool];
        }
        
        await fetch(`http://localhost:3000/student`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.student,
            schools: updatedSchools
          })
        });
        
        this.fetchStudentData();
        this.cancelSchoolForm();
      } catch (error) {
        console.error('Error saving school:', error);
        alert('Failed to save school');
      }
    },
    async deleteSchool(schoolId) {
      if (confirm('Are you sure you want to delete this school?')) {
        try {
          const updatedSchools = this.student.schools.filter(school => school.id !== schoolId);
          
          await fetch(`http://localhost:3000/student`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...this.student,
              schools: updatedSchools
            })
          });
          
          this.fetchStudentData();
        } catch (error) {
          console.error('Error deleting school:', error);
          alert('Failed to delete school');
        }
      }
    }
  }
}
</script>

<style scoped>
.student-profile {
  max-width: 1200px;
  margin: 0 auto;
}
</style>