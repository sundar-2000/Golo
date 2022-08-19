<template>
  <div class="vue-tempalte">
    <form>
      <h3>Sign In</h3>

      <div class="form-group">
        <label>Mobile</label>
        <input v-model="mobile" type="number" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="pswd" type="password" class="form-control form-control-lg" />
      </div>
      <p class="text-center mt-2 text-danger" :style="[isValid ? { 'display': 'none' } : { 'display': 'block' }]">Incorrect Username or Password </p>
      <button @click="checkPswd"  type="button"  class="btn btn-dark btn-lg btn-block">
        Sign In
      </button>

      <div class="social-icons mt-4">
        <ul>
          <li>
            <a href="#"><i class="fa fa-google"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-facebook"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-twitter"></i></a>
          </li>
        </ul>
      </div>

    </form>
  </div>
</template>

<script>
import router from '@/router';
export default {
  data() {
    return {
      mobile: '',
      pswd :'',
      isValid: true
    };
  },
  methods : {
    checkPswd() {
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'mobile':this.mobile,'pswd':this.pswd})
      };

      fetch('http://localhost:8000/driver/login', requestOptions)
        .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          if (!data.isValid) {
              this.isValid = false
              return;
          }
          else{
            router.push({ name: 'driverhome', params: {driver: data  }})
          }

        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });

    }
  }
};

</script>
