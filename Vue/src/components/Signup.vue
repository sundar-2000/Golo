<template>
  <div class="vue-tempalte">
    <form>
      <h3>Sign Up</h3>

      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="name" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Mobile</label>
        <input type="number" v-model="mobile" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="pswd" class="form-control form-control-lg" />
      </div>

      <button @click="checkUser" type="button" class="btn btn-dark btn-lg btn-block">
        Sign Up
      </button>
      <p class="text-center mt-2 text-danger" :style="[exists ? { 'display': 'block' } : { 'display': 'none' }]">User Already Exists</p>
      
    </form>
  </div>
</template>

<script>
import router from '@/router';

export default {
  data() {
    return {

      name: '',
      mobile: '',
      pswd: '',
      exists: false

    };
  },
  methods: {
    checkUser() {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'name': this.name,'mobile':this.mobile,'pswd':this.pswd})
      };
      
      fetch('http://localhost:8000/user/signup', requestOptions)
        .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          if (data.exists) {
              this.exists = true
              return;
          }
          else{
            
            let userData = {
              'name' : this.name,
              'mobile': this.mobile,
              'pswd': this.pswd
            }
            router.push({ name: 'home', params: {user: userData }})
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
