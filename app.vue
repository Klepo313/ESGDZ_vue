<template>
  <div class="html-div">
    <NuxtPage />
  </div>
</template>

<script setup>

const title = ref('Agram upitnik')
const description = ref('Web aplikacija za popunjavanje upitnika')

// This will be reactive when you change title/description above
useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

:root{
  /* Colors */
  --primary-color: #0B78BD;
  --primary_hovered: #2693D9;
  --primary_clicked: #0567A5;
  --white: #FFF;
  --black: #000;
  --light-black: #231f20;
  --input_clicked: #f4f4f4;
  --red: #FF0000;
  --green: #51A927;
  --yellow: #E6B300;
  --border_color: rgb(0, 0, 0, 0.5);
  
  /* Icons */
  --arrow-short_icon: url('./public/icons/arrow-short.svg');
  --checkmark_icon: url('./public/icons/checkmark_icon.svg');
  --list_icon: url('./public/icons/list_icon.svg');
  --lock_icon: url('./public/icons/lock_icon.svg');
  --profile_icon: url('./public/icons/profile_icon.svg');
  --question_icon: url('./public/icons/question_icon.svg');
  --search_icon: url('./public/icons/search_icon.svg');
  --settings_icon: url('./public/icons/settings_icon.svg');
  --stack_icon: url('./public/icons/stack_icon.svg');
  --time_icon: url('./public/icons/time_icon.svg');

  /* Font */
  --font-family: 'Open Sans', sans-serif;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);

  transition: all 100ms ease-in-out;
  scroll-behavior: smooth;
  text-wrap: wrap;
}
::placeholder{
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: var(--light-black);
}
/* .html-div{
  width: 100%;
  max-width: 1500px;

  display: flex;
  align-items: center;
  justify-content: center;
} */
h1{
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 41px;
  color: var(--light-black);
}
h2{
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  padding-bottom: 10px;
  color: var(--light-black);
}
input {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  color: var(--light-black);
  border: 1px solid var(--border_color);
  border-radius: 5px;
  width: 460px;
  max-width: 460px;
  outline: none;
} 
select {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  color: var(--light-black);
  border: 1px solid var(--border_color);
  border-radius: 5px;
  width: 100%;
  max-width: 460px;
  outline: none;
  background: none;
} 

input:hover{
  background-color: #E7F2F9;
}
input:focus{
  background-color: #E7F2F9;
  border-color: var(--light-black);
}
button{
  outline: none;
  border: none;
  background-color: none;
}
.dashboard_text{
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #231f20;
}
.dashboard_text_active{
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: white;
  background-color: var(--primary-color);
}
.dashboard_icon_active{
  filter: invert(1);
}

.card_title{
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 0.03em;
  text-transform: capitalize;
  color: var(--light-black);
}
.card_properties{
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: var(--light-black);  
}
.card_status{
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  text-transform: uppercase;
  color: var(--yellow);
}
.input_label{
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
}
.button_text{
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: var(--white);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.info_empty{
  font-size: 14px;
  opacity: 0.7;
  font-weight: 400;
}

/* GRUPE, KATEGORIJE, PODGRUPE */
/*table{
  margin-top: 20px;
  width: 100%;
  text-align: left;
  border-radius: 5px;
  border-collapse: collapse;
}
th{
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-transform: capitalize;
  color: #000000;
}
tr > th{
  padding-bottom: 10px;
  border-bottom: 0.5px solid rgb(0, 0, 0, 0.1);
}
.th-div > img{
  width: 16px;
  height: 16px;
}
.th-div{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}
table tr th {
  vertical-align: middle;
}
.header{
  font-size: 89px;
}
.data_row {
  border-radius: 5px;
}
.data_row td{
  padding: 10px 22px; 
}
.name, .no_Questions_done{
  font-weight: 600;
}
td:first-child{
  border-radius: 5px 0px 0px 5px;
}
td:last-child{
  border-radius: 0px 5px 5px 0px;
}
tr:hover td{
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
} */
</style>