<template>

  <div>
    <!-- ***** Header Area Start ***** -->
    <header class="header_area" id="header">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col-12 h-100">
            <nav class="h-100 navbar navbar-expand-lg">
              <!-- Nav -->
              <div class="collapse navbar-collapse" id="dorneNav">
                <ul class="navbar-nav mr-auto" id="dorneMenu">
                  <li class="nav-item active">
                    <a class="nav-link" href="#">Golo</a>
                  </li>
                </ul>
                <!-- Add listings btn -->
                <div class="dorne-add-listings-btn">
                  <a href="#" @click="showBookings" class="btn dorne-btn">Past Bookings</a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- ***** Main Area Start ***** -->
    <section class="dorne-welcome-area bg-img bg-overlay" :style="{ backgroundImage: `url(${bg})` }">

      <div v-if="loading" class="loaderContainer">
        <div class="loaderContent">
          <div v-if="isFetched">
            <div>{{ bookingDetails }}</div>
            <div class="d-flex align-items-center justify-content-center p-5 ">
              <button @click="closeLoader" type="button" class="btn dorne-btn">
                Ok</button>
            </div>
          </div>
          <div v-else>
            <h4 class="mb-3">Finding your nearby drivers</h4>
            <div class="d-flex justify-content-center">
              <dot-loader :color="color"></dot-loader>
            </div>
          </div>
        </div>

      </div>
      <div class="container h-100">
        <div class="row h-100 align-items-center justify-content-center">
          <div class="col-12 col-md-10">
            <div class="hero-content">
              <h2>Discover places near you</h2>
              <h4>The best guide of your city</h4>
            </div>

            <div class="hero-search-form">

              <!-- Tabs Content -->
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-places" role="tabpanel" aria-labelledby="nav-places-tab">
                  <h6 class="text-center" style="font-family: monospace;">Where are you heading to?</h6>
                  <form action="#" method="get">

                    <div class="d-flex flex-column">
                      <label class="h5 text-white">From</label>
                      <input v-model="from" type="number" class="custom-input" />
                    </div>
                    <div class="d-flex flex-column">
                      <label class="h5 text-white">To</label>
                      <input v-model="to" type="number" class="custom-input" />
                    </div>

                  </form>
                </div>


              </div>
            </div>
            <div class="d-flex align-items-center justify-content-center p-5 ">
              <button @click="getDriver" type="button" class="btn dorne-btn">
                Book</button>
            </div>
          </div>
        </div>

      </div>

    </section>
    <modal :name="user.name" :data="bookings" v-show="showModal" @close-modal="showModal = false"></modal>
  </div>
  <!-- ***** Main Area End ***** -->

</template>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="{{ asset('js/app.js') }}" defer></script>
<script>
import Bg from '@/assets/hero-1.jpg'
import { DotLoader } from 'vue-spinner/dist/vue-spinner.min.js'
import Modal from './BookingModal';
var $ = require( "jquery" );
export default {
  data() {
    return {

      from: '',
      to: '',
      pswd: '',
      bg: Bg,
      loading: false,
      bookingDetails: '',
      color: 'black',
      isFetched: false,
      showModal : false,
      bookings: [],

    };
  },
  props: ['user'],
  components: {
    'DotLoader': DotLoader,
    'modal':Modal
  },
  methods: {
    getDriver() {
      this.bookingDetails = '';
      this.isFetched = false;
      this.loading = true;
      var userData = {};
      userData['name'] = this.user.name;
      userData['mobile'] = this.user.mobile;
      userData['from'] = this.from;
      userData['to'] = this.to;

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      };
      fetch('http://localhost:8000/bookDriver', requestOptions)
        .then(async response => {
          const data = await response.json();
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setTimeout(() => {
            this.bookingDetails = data.msg;
            this.isFetched = true
          }, 3000)
          // alert(data.msg);

        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
    },

    closeLoader() {
      this.loading = false
    },

    showBookings(){
      
      fetch(`http://localhost:8000/user/bookings/${this.user.mobile}`)
        .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          this.bookings = data;
          //console.log(data);
          this.showModal = true;
          
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
      
    }
  }
};
</script>
<style scoped>
h1 {
  font-family: 'Montserrat', sans-serif;
  color: #fff;
  font-weight: 900;
  font-size: 2rem;
}


body {
  font-family: 'Open Sans', sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  color: #2a2a2a;
  line-height: 1.3;
}

p {
  color: #848484;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}

.section-padding-150 {
  padding-top: 150px;
  padding-bottom: 150px;
}

.section-padding-150-0 {
  padding-top: 150px;
  padding-bottom: 0;
}

.section-padding-0-150 {
  padding-top: 0;
  padding-bottom: 150px;
}

.section-padding-100-50 {
  padding-top: 100px;
  padding-bottom: 50px;
}

.section-padding-100 {
  padding-top: 100px;
  padding-bottom: 100px;
}

.section-padding-100-0 {
  padding-top: 100px;
  padding-bottom: 0;
}

.section-padding-0-100 {
  padding-top: 0;
  padding-bottom: 100px;
}

img {
  max-width: 100%;
  height: auto;
}

.mt-15 {
  margin-top: 15px;
}

.mt-30 {
  margin-top: 30px;
}

.mt-40 {
  margin-top: 40px;
}

.mt-50 {
  margin-top: 50px;
}

.mt-100 {
  margin-top: 100px;
}

.mt-150 {
  margin-top: 150px;
}

.mr-15 {
  margin-right: 15px;
}

.mr-30 {
  margin-right: 30px;
}

.mr-50 {
  margin-right: 50px;
}

.mr-100 {
  margin-right: 100px;
}

.mb-15 {
  margin-bottom: 15px;
}

.mb-30 {
  margin-bottom: 30px;
}

.mb-50 {
  margin-bottom: 50px;
}

.mb-100 {
  margin-bottom: 100px;
}

.ml-15 {
  margin-left: 15px;
}

.ml-30 {
  margin-left: 30px;
}

.ml-50 {
  margin-left: 50px;
}

.ml-100 {
  margin-left: 100px;
}

ul,
ol {
  margin: 0;
  padding: 0;
}

a,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  -webkit-transition-duration: 500ms;
  transition-duration: 500ms;
  outline: none;
  font-weight: 600;
}

li {
  list-style: none;
}

.height-500 {
  height: 500px !important;
}

.height-600 {
  height: 600px !important;
}

.height-700 {
  height: 700px !important;
}

.height-800 {
  height: 800px !important;
}

.dorne-table {
  display: table;
  height: 100%;
  left: 0;
  position: relative;
  top: 0;
  width: 100%;
  z-index: 2;
}

.dorne-table-cell {
  display: table-cell;
  vertical-align: middle;
}

.section-heading {
  position: relative;
  z-index: 1;
  margin-bottom: 100px;
}

.section-heading span {
  width: 30px;
  height: 2px;
  background-color: #fff;
  margin: 0 auto 15px;
  display: block;
}

.section-heading h4 {
  font-weight: 800;
  line-height: 1;
  color: #fff;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.section-heading p {
  line-height: 1;
  color: #fff;
  margin-bottom: 0;
}

.section-heading.dark span {
  background-color: #7643ea;
}

.section-heading.dark h4 {
  color: #2a2a2a;
}

.section-heading.dark p {
  color: #848484;
}

#scrollUp {
  bottom: 70px;
  font-size: 18px;
  right: 0;
  width: 40px;
  color: #fff;
  text-align: center;
  height: 40px;
  line-height: 44px;
  border-radius: 0;
  font-size: 36px;
}

.bg-img {
  background-position: center center;
  background-size: cover;
}

.bg-overlay,
.bg-overlay-9 {

  z-index: 1;
}

.bg-overlay:after,
.bg-overlay-9:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(14, 2, 35, 0.5);
  z-index: -1;
}

.bg-overlay-9:after {
  background-color: rgba(14, 2, 35, 0.9);
}

.bg-gray {
  background-color: #f9f9f9;
}

.bg-default {
  background-color: #341a79;
}

.dorne-btn {
  min-width: 180px;
  height: 52px;
  background-color: #ff4f5a;
  border-radius: 0;
  padding: 0 15px;
  line-height: 50px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  -webkit-transition-duration: 500ms;
  transition-duration: 500ms;
}

.dorne-btn:hover,
.dorne-btn:focus {
  color: #fff;
  background-color: #ff4f5aaa;
  font-weight: 600;
}

/* Search Area CSS */

.dorne-search-form {
  width: 100%;
  position: fixed;
  z-index: 99999;
  height: 120px;
  background-color: #341a79;
  top: -200px;
  left: 0;
  -webkit-transition-duration: 500ms;
  transition-duration: 500ms;
  overflow-x: hidden;
}

.search-form-on .dorne-search-form {
  top: 0;
}

.sticky .dorne-search-form {
  height: 80px;
}

.dorne-search-form form {
  position: relative;
  z-index: 1;
}

.dorne-search-form form input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-color: transparent;
  height: 50px;
  color: #fff;
  padding: 0 20px;
  font-size: 14px;
}

#closeBtn {
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 9;
  background-color: transparent;
  margin-top: -15px;
  top: 50%;
  border-radius: 50%;
  right: 30px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  opacity: 0.5;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
  -webkit-transition-duration: 500ms;
  transition-duration: 500ms;
}

#closeBtn:hover {
  opacity: 1;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
}

#closeBtn>i {
  line-height: 30px;
  font-size: 28px;
}

/* Header & Menu Area CSS */

.header_area {
  position: fixed;
  width: 100%;
  z-index: 9999;
  height: 120px;
  top: 0;
  left: 0;
  z-index: 99;
  -webkit-transition-duration: 700ms;
  transition-duration: 700ms;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0 30px;
}

.sticky .header_area {
  background-color: rgba(14, 2, 35, 0.9);
  height: 80px;
  z-index: 9999;
  border-bottom: 1px solid transparent;
}

.navbar-brand {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin-right: 70px;
}

.navbar-brand:hover,
.navbar-brand:focus {
  color: #fff;
  font-weight: 700;
}

.navbar-expand-lg .navbar-nav .nav-link {
  padding-right: 15px;
  padding-left: 15px;
  color: #fff;
  font-size: 15px;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-item.active .nav-link {
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
}

.dorne-search-btn>a,
.dorne-signin-btn>a {
  color: #fff;
  display: inline-block;
  margin-right: 40px;
  font-size: 15px;
}

.dorne-search-btn>a i {
  padding-right: 10px;
}

.dropdown-menu {
  border: none;
}

.dropdown-item {
  font-weight: 600;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #7643ea;
  color: #fff;
}

.dropdown-toggle:after {
  border: none;
}

/* Welcome Area CSS */

.dorne-welcome-area {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.hero-content h2 {
  color: #fff;
  font-size: 72px;
}

.hero-content h4 {
  color: #fff;
  margin-bottom: 0;
  padding-left: 5px;
}

.hero-search-form {
  margin-top: 90px;
  position: relative;
  z-index: 1;
}

.hero-search-form .nav-tabs {
  border-bottom: none;
}

.hero-search-form .nav-tabs .nav-link {
  border: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  min-width: 100px;
  height: 44px;
  line-height: 44px;
  padding: 0;
  text-align: center;
}

.hero-search-form .nav-tabs .nav-link.active {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.35);
  border-color: transparent;
}

.hero-search-form .tab-content .tab-pane {
  padding: 35px;
  background-color: rgba(0, 0, 0, 0.35);
  font-family: monospace;
}

.hero-search-form .tab-content .tab-pane h6 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 25px;
}

.hero-search-form .tab-content .tab-pane form {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
}


.hero-search-form .tab-content .tab-pane form .custom-input {
  height: 52px;
  border-radius: 0;
  padding: 0 80px 0 40px;
  color: #72728c;
  font-size: 12px;
  font-weight: 600;
  border: none;
  margin-right: 10px;
  outline: none;
}

.hero-social-btn {
  position: absolute;
  width: auto;
  height: auto;
  bottom: 90px;
  left: 60px;
  z-index: 9;
}

.hero-social-btn .social-title {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  margin-left: -145px;
}

.hero-social-btn .social-title h6 {
  margin-bottom: 0;
  color: #fff;
  line-height: 1;
  margin-right: 30px;
}

.hero-social-btn .social-title span {
  background-color: #fff;
  width: 80px;
  height: 1px;
  display: block;
}

.hero-social-btn .social-btns {
  margin-top: 170px;
}

.hero-social-btn .social-btns>a {
  font-size: 15px;
  color: #fff;
  display: block;
  margin-top: 30px;
}

.loaderContainer {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  z-index: 9;
}

.loaderContent {
  border-radius: 5px;
  background-color: #fff;
  padding: 5rem;
  width: 30vw;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
}
</style>