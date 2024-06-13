<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header text-center">
            <h2>OTP Registration</h2>
          </div>
          <div class="card-body text-center">
            <button class="btn btn-primary" @click="registerOtp">
              Register OTP
            </button>
            <div v-if="qrCodeHtml" class="mt-4">
              <div v-html="qrCodeHtml"></div>
              <button class="btn btn-secondary mt-3" @click="goToEditPassword">
                비밀번호 변경
              </button>
            </div>
            <div v-if="error" class="alert alert-danger mt-4">
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
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      qrCodeHtml: '',
      error: ''
    };
  },
  setup() {
    const router = useRouter();

    const goToEditPassword = () => {
      router.push('/my-page/edit-password');
    };

    return {
      goToEditPassword
    };
  },
  methods: {
    async registerOtp() {
      try {
        const response = await axios.get('/otp/regist');
        this.qrCodeHtml = response.data;
        this.error = ''; // Clear any previous errors
      } catch (error) {
        console.error('Error registering OTP:', error);
        this.error = 'Failed to register OTP. Please try again.';
      }
    }
  }
};
</script>
