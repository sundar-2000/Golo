<template>
    <div>
        <h1 class="text-center">Hi {{ driver.name }} !!</h1>
        <h5 class="text-center mt-3">Total earnings $ {{ driver.earnings }}</h5>
            
        <div class="modal1">
            

                <div v-for="travel in travels" class="list">
                    <p>You Picked up {{ travel.username }} from {{ travel.source }} and dropped them in {{
                            travel.destination
                    }} </p>
              
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: '',
            travels: []

        };
    },
    props: ['driver'],
    methods: {
        getHistroy() {
            fetch(`http://localhost:8000/driver/bookings/${this.driver.mobile}`)
                .then(async response => {
                    const data = await response.json();

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    this.travels = data;
                    //console.log(data);
                    this.showModal = true;

                })
                .catch(error => {
                    this.errorMessage = error;
                    console.error('There was an error!', error);
                });
        }
    },
    beforeMount() {
        this.getHistroy()
    }
}
</script>
<style scoped>
.modal1 {
    text-align: center;
    width: 700px;
    padding: 40px 0;
   
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

.scrollDiv {
    max-height: 75%;
    overflow: auto;
}

.list {
    padding: .5rem;
    font-size: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,.5);
    margin-bottom: 1rem;

}
</style>
