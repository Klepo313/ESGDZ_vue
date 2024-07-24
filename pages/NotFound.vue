<template>
    <div class="not-found">
        <div class="content">
            <h1>404</h1>
            <h2>Stranica nije pronađena</h2>
            <p>Stranica koju tražite možda je uklonjena, promijenjena ili je privremeno nedostupna.</p>
            <router-link to="/" class="home-link">
                <font-awesome-icon :icon="['fas', 'house']" class="icon" />
                Početna stranica
            </router-link>
            <router-link to="/login" class="login-link">Prijava</router-link>
        </div>
    </div>
</template>

<script setup>
// Ovdje možete dodati skriptu ako je potrebno
</script>

<style scoped>
.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f7f6;
    font-family: 'Open Sans', sans-serif;
    text-align: center;
    color: #333;
}

.content {
    max-width: 600px;
    padding: 20px;
}

h1 {
    font-size: 10rem;
    color: #0B78BD;
    font-weight: 600;
}

.icon {
    margin-right: 10px;
}

h2 {
    font-size: 2rem;
    margin-top: 60px;
    font-weight: 600;
}

p {
    font-size: 1.2rem;
    margin: 20px 0;
}

.home-link,
.login-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.home-link {
    color: #fff;
    background-color: #0B78BD;
}

.home-link:hover {
    background-color: #095a8a;
}

.login-link {
    color: #0B78BD;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 2px solid #0B78BD;
    /* border-inline: 2px solid #0B78BD; */
    margin-left: 10px;
}

.login-link:hover {
    background-color: #f0f8ff;
}
</style>