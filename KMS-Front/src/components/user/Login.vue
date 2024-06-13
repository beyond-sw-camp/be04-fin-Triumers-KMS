<template>
  <div class="container">
    <div class="login-form" :class="{ 'mfa-active': mfaRequired }">
      <h2 class="form-title">로그인</h2>
      <form @submit.prevent="login">
        <div v-if="!mfaRequired" class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" required class="form-input" />
        </div>
        <div v-if="!mfaRequired" class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required class="form-input" />
        </div>
        <div v-if="mfaRequired" class="form-group mfa-group">
          <p class="mfa-message">{{ mfaMessage }}</p>
          <label for="otp">MFA 코드</label>
          <input type="text" id="otp" v-model="otpCode" required class="form-input" />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const email = ref('');
const password = ref('');
const otpCode = ref('');
const mfaRequired = ref(false);
const mfaMessage = ref('MFA 인증이 필요합니다.');

// 로그인 상태 확인 함수
const checkLoginStatus = () => {
  if (store.state.isLoggedIn) {
    alert('이미 로그인한 상태입니다.');
    router.push('/wiki/1');
  }
};

async function login() {
  if (!mfaRequired.value) {
    try {
      const authResponse = await axios.post('/auth/check-authenticator', {
        email: email.value,
        password: password.value,
      });

      if (authResponse.status === 200) {
        // 기본 로그인 절차
        const loginResponse = await axios.post('/login', {
          email: email.value,
          password: password.value,
        });
        const token = loginResponse.headers.get('Authorization');
        const userRole = loginResponse.headers.get('UserRole');
        store.dispatch('login', { token, userRole });

        if (loginResponse.status === 210) {
          // 초기 비밀번호인 경우 비밀번호 변경 페이지로 이동
          alert('2차 인증을 등록해주세요.');
          router.push({ path: '/otp-registration', query: { initialPassword: true, token } });
          return;
        }
        
        await router.push('/wiki/1');
      } else if (authResponse.status === 202) {
        // MFA 인증 필요
        mfaRequired.value = true;
      }
    } catch (error) {
      console.error('Failed to login:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  } else {
    try {
      const loginResponse = await axios.post('/login', {
        email: email.value,
        password: password.value,
        otpCode: otpCode.value,
      });
      const token = loginResponse.headers.get('Authorization');
      const userRole = loginResponse.headers.get('UserRole');
      store.dispatch('login', { token, userRole });
      await router.push('/wiki/1');
    } catch (error) {
      console.error('Failed to login with MFA:', error);
      mfaMessage.value = 'MFA 코드를 확인해주세요.';
    }
  }
}

onMounted(() => {
  checkLoginStatus();
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.login-form {
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 4px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #0c5195;
}

.mfa-active .form-group:not(.mfa-group) {
  transform: translateY(-100%);
  opacity: 0;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.mfa-group {
  transition: all 0.3s ease-in-out;
}

.mfa-message {
  font-size: 16px;
  font-weight: bold;
  color: #d9534f;
  margin-bottom: 10px;
}
</style>