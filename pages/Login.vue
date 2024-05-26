<template>
    <div>
        <div class="main">
            <div class="pop-up-login" id="pop-up-login">
                <font-awesome-icon icon="close" class="icon-close" size="sm"></font-awesome-icon>
                <span>Krivo korisničko ime ili lozinka!</span>
            </div>
            <div class="content">
                <div class="imageDiv">
                    <img class="logo" src="../public/images/agram_lolo.png" alt="logo">
                </div>
                <form @submit.prevent="handleSubmit" action="">
                    <div class="input-div">
                        <label class="input-label" for="username">Korisničko ime</label>
                        <font-awesome-icon icon="user" class="icon"  />
                        <input type="text" v-model="username" id="username" placeholder="Unesi korisničko ime">
                    </div>
                    <div class="input-div">
                        <label class="input-label" for="password">Lozinka</label>
                        <font-awesome-icon icon="lock" class="icon"  />
                        <input type="password" v-model="password" id="password" placeholder="Unesi lozinku">
                    </div>
                    <button type="submit" class="login-btn" id="loginBtn">
                        <span class="login-btn-text">Prijava</span>
                        <font-awesome-icon id="spin-icon" icon="spinner" size="xl" spin />
                    </button>
                </form>
            </div>
            <span class="footer-text">© Agram banka Zagreb članica je Agram EEIG</span>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { useUserInfoStore } from '~/stores/userInfoStore.js';
    import { useUpitnikInfoStore } from '#imports';

    const userInfoStore = useUserInfoStore();
    const upitnikInfoStore = useUpitnikInfoStore();

    const username = ref('');
    const password = ref('');
    const router = useRouter();
    const url = 'http://localhost:5000';

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${url}/login`, {
                username: username.value.toUpperCase(),
                password: password.value
            });

            console.log(response.data);

            const spin_icon = document.getElementById("spin-icon");
            const prijava = document.getElementsByClassName("login-btn-text")[0];

            prijava.style.display = "none";
            spin_icon.style.display = 'inline';

            // Ako prijava uspije, prosljedi korisnika na '/upitnici'
            if (response.data.success) {
                userInfoStore.setEkoParId(parseInt(response.data.user.eko_par_id_za))
                userInfoStore.setEkoId(parseInt(response.data.user.eko_id))
                userInfoStore.setEkoKorime(response.data.user.eko_korime)

                router.push('/upitnik');
            }
        } catch (error) {
            // Call the function to see the effect
            highlightBorders();
            console.error('Greška prilikom prijave:', error)

            // const popUpLogin = document.getElementById('pop-up-login');
            // popUpLogin.style.display = 'block';
            // popUpLogin.classList.add('slideIn');

            // // Postavljanje vremena za nestajanje pop-up-a nakon nekoliko sekundi
            // setTimeout(() => {
            //     popUpLogin.classList.remove('slideIn');
            //     popUpLogin.classList.add('slideOut');

            //     setTimeout(() => {
            //         popUpLogin.style.display = 'none';
            //     }, 500);
            // }, 3000);
        }
    };

    // Function to change border styles and revert after 5 seconds
    const highlightBorders = () => {
        const usernameField = document.getElementById('username')
        const passwordField = document.getElementById('password')

        // Change border styles to red
        usernameField.style.border = '3px solid red';
        passwordField.style.border = '3px solid red';

        // Set timeout to revert border styles after 5 seconds
        setTimeout(() => {
            usernameField.style.border = '';  // Revert to default
            passwordField.style.border = '';  // Revert to default
        }, 3000);  // 5000 milliseconds = 5 seconds
    };


    onMounted(() => {
        userInfoStore.clearUserInfo();
        upitnikInfoStore.clearUpitnikInfo();
    })

</script>

<style scoped>
*{
    font-size: 14px;
}
/* Animacija pojavljivanja */
@keyframes slideIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Animacija nestajanja */
@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
.slide-in {
  animation: slideIn 0.5s both;
}

.slide-out {
  animation: slideOut 0.5s both;
}
.pop-up-login{
    display: none;
    position: absolute;
    padding: 10px 50px;
    top: 20px;
    color: white;
    border-radius: 5px;
    background-color: rgb(230, 0, 0);
    animation-duration: 0.5s; /* Trajanje animacije */
    animation-fill-mode: both;
}
.icon-close{
    position: absolute;
    top: 6px;
    right: 6px;
}
.icon-close:hover{
    opacity: 0.8;
}
.content, .main{
    display: flex;
    align-items: center;
    justify-content: center;
}
.main {
    height: 100dvh;
    width: 100%;
}
.content{
    flex-direction: column;
    justify-content: center;
    align-items: space-between;
    gap: 60px;
}
.input-div{
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.imageDiv{
    max-width: 387px;
}
.logo{
    width: 100%;
}
form{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
input {
    padding: 10px 18px;
    padding-left: 48px;
    font-size: 14px;
    font-weight: 500;
    color: var(--light-black);
    border: 1px solid var(--border_color);
    border-radius: 5px;
    width: 460px;
    max-width: 365px;
    outline: none;
}
input:hover{
    background-color: #E7F2F9;
}
input:focus{
    background-color: #E7F2F9;
    border: 1px solid var(--border_color);
    border-color: var(--light-black);
}
.input-div .icon{
    position: absolute;
}
.icon{
    margin-left: 18px;
    margin-top: 43px;
}
button{
    font-weight: 600;
    color: white;
    padding: 12px 0px;
    border-radius: 5px;
    background-color: var(--primary-color);
}
#spin-icon{
    display: none;
}
button:hover{
    cursor: pointer;
    background-color: var(--primary_hovered);
}
button:active{
    background-color: var(--primary_clicked);
}
.footer-text{
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: 30px;
    opacity: 60%;
}
</style>
