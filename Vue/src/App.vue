<template>
  <div class="vue-tempalte main bg-white">
    <!-- Navigation --
    
  -->
  <router-view />
 
  </div>
</template>
<script>
export default {
  data() {
    return {
      logo: require('./assets/logo.jpg')
    };
  },
};
</script>
<style scoped>
.main{
  display: flex;
  flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex: 1;
}
.container {
    flex: 0 0 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
#title{
  font-size: 5rem;
}
#stitle{
  font-size: 1.5rem;
  color: rgba(0,0,0,.75);
}
</style>