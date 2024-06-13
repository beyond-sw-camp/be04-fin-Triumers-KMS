<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header text-center">
              <h2>Health Check</h2>
            </div>
            <div class="card-body text-center">
              <div class="btn btn-primary mb-3" @click="checkServerStatus">
                Check Server Status
              </div>
              <div v-if="serverStatus" class="alert alert-info">
                {{ serverStatus }}
              </div>
              <div class="btn btn-primary mb-3" @click="checkIpAddress">
                Check IP Address
              </div>
              <div v-if="ipAddress" class="alert alert-info">
                {{ ipAddress }}
              </div>
              <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        serverStatus: '',
        ipAddress: '',
        error: ''
      };
    },
    methods: {
      async checkServerStatus() {
        try {
          const response = await axios.get('/health-check');
          this.serverStatus = response.data;
          this.error = ''; // Clear any previous errors
        } catch (error) {
          console.error('Error checking server status:', error);
          this.serverStatus = '';
          this.error = 'Failed to check server status. Please try again.';
        }
      },
      async checkIpAddress() {
        try {
          const response = await axios.get('/is-in-house');
          this.ipAddress = response.data;
          this.error = ''; // Clear any previous errors
        } catch (error) {
          console.error('Error checking IP address:', error);
          this.ipAddress = '';
          this.error = 'Failed to check IP address. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .card-header {
    background-color: #042444;
    color: white;
  }
  .btn-primary {
    background-color: #042444;
    border-color: #042444;
  }
  .btn-primary:hover {
    background-color: #1b2cba;
    border-color: #1b2cba;
  }
  .alert-info {
    margin-top: 10px;
  }
</style>
