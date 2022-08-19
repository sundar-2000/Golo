<template>
    <div class="main">
        <div class="container">
            <img :src="logo" height="500">
        </div>
        <!-- Main -->
        <div class="App container">
            <div class="vertical-center">
                <div class="text-center">
                    <h1 id="title">Golo</h1>
                    <p id="stitle" >Pick your trip on the go</p>
                </div>
                <div class="inner-block">
                    <Signup v-if="isNew"></Signup>
                    <Login v-else></Login>
                    <p v-if="isNew" class="forgot-password text-right">
                        Already registered ?
                        <span @click="toggle" class="underline text-primary">Sign In</span>
                    </p>
                    <p v-else class="forgot-password text-right ">
                        New User ?
                        <span @click="toggle" class="underline text-primary">Sign Up</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


import Signup from './DriverSignup';
import Login from './DriverLogin';
import Logo from '@/assets/driver.jpg'

export default {
    data() {
        return {
            logo: Logo,
            isNew: false
        };
    },
    components: {
        Signup,
        Login,
        Login
    },
    methods: {
        toggle() {
            this.isNew = !this.isNew;
        }
    }
};
</script>
<style scoped>
.main {
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

#title {
    font-size: 5rem;
    font-family: 'Montserrat', sans-serif;
}

#stitle {
    font-size: 1.5rem;
    font-family: monospace;
    color: rgba(0, 0, 0, .75);
}
</style>