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
                        <font-awesome-icon :icon="['fas', 'user']" class="icon" />
                        <input type="text" v-model="username" id="username" placeholder="Unesi korisničko ime">
                    </div>
                    <div class="input-div">
                        <label class="input-label" for="password">Lozinka</label>
                        <font-awesome-icon :icon="['fas', 'lock']" class="icon" />
                        <input type="password" v-model="password" id="password" placeholder="Unesi lozinku">
                    </div>
                    <button type="submit" class="login-btn" id="loginBtn">
                        <span class="login-btn-text">Prijava</span>
                        <font-awesome-icon id="spin-icon" icon="spinner" size="xl" spin />
                    </button>
                    <span class="wrongPass">
                        <font-awesome-icon :icon="['far', 'circle-xmark']" />
                        Krivo uneseno korisničko ime ili lozinka
                    </span>
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
const public_url = 'https://esgdz-server.onrender.com';
const local_url = 'http://localhost:5000';
//const local_url = 'http://app.agrambanka.hr:5000';

const handleSubmit = async () => {

    const spin_icon = document.getElementById("spin-icon");
    const prijava = document.getElementsByClassName("login-btn-text")[0];

    prijava.style.display = "none";
    spin_icon.style.display = 'inline';

    try {
        const response = await axios.post(`${local_url}/login`, {
            username: username.value.toUpperCase(),
            password: password.value
        });

        console.log(response.data);
        if (response.data.success) {
            userInfoStore.setUserInfo({
                eko_par_id_za: parseInt(response.data.user.eko_par_id_za),
                eko_id: parseInt(response.data.user.eko_id),
                eko_korime: response.data.user.eko_korime
            });
            router.push('/upitnik');
        }

    } catch (error) {
        // Call the function to see the effect
        highlightBorders();
        prijava.style.display = "inline";
        spin_icon.style.display = 'none';
        console.error('Korisnik nije pronađen.')
    }
};

// Function to change border styles and revert after 5 seconds
const highlightBorders = () => {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const wrongPass = document.getElementsByClassName("wrongPass")[0];

    // Change border styles to red
    usernameField.style.border = '3px solid red';
    passwordField.style.border = '3px solid red';
    wrongPass.style.display = "inline";

    // Set timeout to revert border styles after 5 seconds
    setTimeout(() => {
        usernameField.style.border = '';  // Revert to default
        passwordField.style.border = '';  // Revert to default
        wrongPass.style.display = "none";
    }, 3000);  // 5000 milliseconds = 5 seconds
};


onMounted(() => {
    userInfoStore.clearUserInfo();
    upitnikInfoStore.clearUpitnikInfo();
})

</script>

<style scoped>
* {
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

.pop-up-login {
    display: none;
    position: absolute;
    padding: 10px 50px;
    top: 20px;
    color: white;
    border-radius: 5px;
    background-color: rgb(230, 0, 0);
    animation-duration: 0.5s;
    /* Trajanje animacije */
    animation-fill-mode: both;
}

.icon-close {
    position: absolute;
    top: 6px;
    right: 6px;
}

.icon-close:hover {
    opacity: 0.8;
}

.content,
.main {
    display: flex;
    align-items: center;
    justify-content: center;
}

.main {
    height: 100dvh;
    width: 100%;
}

.content {
    flex-direction: column;
    justify-content: center;
    align-items: space-between;
    gap: 60px;
}

.input-div {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.imageDiv {
    max-width: 387px;
}

.logo {
    width: 100%;
}

form {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
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

input:hover {
    background-color: #E7F2F9;
}

input:focus {
    background-color: #E7F2F9;
    border: 1px solid var(--border_color);
    border-color: var(--light-black);
}

.input-div .icon {
    position: absolute;
}

.icon {
    margin-left: 18px;
    margin-top: 40px;
}

button {
    font-weight: 600;
    color: white;
    padding: 12px 0px;
    border-radius: 5px;
    background-color: var(--primary-color);
    width: 100%;
}

#spin-icon {
    display: none;
}

button:hover {
    cursor: pointer;
    background-color: var(--primary_hovered);
}

button:active {
    background-color: var(--primary_clicked);
}

.footer-text {
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: 30px;
    opacity: 60%;
}

.wrongPass {
    display: none;
    color: rgb(206, 0, 0);
    font-weight: 600;
    position: absolute;
    bottom: -40px;
}
</style>
