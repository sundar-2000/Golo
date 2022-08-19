
  <template>
  <div class="modal-overlay">
    <div class="modal1">
      
      <h6>Hello  {{name}}</h6>
      <h5>Your Travel Details:</h5>
      <div class="scrollDiv">
        <ul>
          
      <li v-for="travel in data">
          <p>You Travelled from {{travel.source}} to {{travel.destination}} with our driver {{travel.driver}} </p>
      </li>
      </ul>
      </div>
      <button class="closeModal btn" @click="$emit('close-modal')">Go Home</button>
    </div>
    
  </div>
</template>



<script>
export default {
  data() {
    return {

    };
  },
  props:{
    name : String,
    data : Array
  },
  methods: {
    
  }
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 9;
  
}

.modal1 {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.closeModal {
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ff4f5a;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
}
.scrollDiv{
  max-height: 75%;
  overflow: auto;
}
</style>
