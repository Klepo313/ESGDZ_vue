// import { defineStore } from 'pinia';
// import Cookies from 'js-cookie';

// export const useUserInfoStore = defineStore('userInfo', {
//   state: () => ({
//     eko_par_id_za: null,
//     eko_id: null,
//     eko_korime: null
//   }),
//   actions: {
//     initializeStore() {
//       if (process.client) {
//         this.eko_par_id_za = Cookies.get('eko_par_id_za');
//         this.eko_id = Cookies.get('eko_id');
//         this.eko_korime = Cookies.get('eko_korime');
//       }
//     },
//     setEkoParId(ekoParId) {
//       this.eko_par_id_za = ekoParId;
//       if (process.client) {
//         Cookies.set('eko_par_id_za', ekoParId, { expires: 7, secure: process.env.NODE_ENV === 'production' });
//       }
//     },
//     setEkoId(ekoId) {
//       this.eko_id = ekoId;
//       if (process.client) {
//         Cookies.set('eko_id', ekoId, { expires: 7, secure: process.env.NODE_ENV === 'production' });
//       }
//     },
//     setEkoKorime(ekoKorime) {
//       this.eko_korime = ekoKorime;
//       if (process.client) {
//         Cookies.set('eko_korime', ekoKorime, { expires: 7, secure: process.env.NODE_ENV === 'production' });
//       }
//     },
//     clearUserInfo() {
//       this.eko_par_id_za = null;
//       this.eko_id = null;
//       this.eko_korime = null;
//       if (process.client) {
//         Cookies.remove('eko_par_id_za');
//         Cookies.remove('eko_id');
//         Cookies.remove('eko_korime');
//       }
//     },
//   },
//   getters: {
//     ekoParId: state => state.eko_par_id_za,
//     ekoId: state => state.eko_id,
//     ekoKorime: state => state.eko_korime
//   }
// });

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { local_url } from '~/services/services';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    eko_par_id_za: null,
    eko_id: null,
    eko_korime: null
  }),
  actions: {
    async initializeStore() {
      if (!import.meta.env.SSR) {
        // Dohvati podatke s servera
        const response = await fetch(`${local_url}/get-user-cookies`, {
          method: 'GET',
          credentials: 'include'
        });
        
        const cookies = await response.json();
        console.log(cookies);
        this.eko_par_id_za = cookies.eko_par_id_za;
        this.eko_id = cookies.eko_id;
        this.eko_korime = cookies.eko_korime;
      }
    },
    async setEkoParId(ekoParId) {
      this.eko_par_id_za = ekoParId;
      console.log("Stavljeno eko_par_id_za: ", ekoParId, typeof ekoParId);
      await fetch(`${local_url}/set-user-cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eko_par_id_za: ekoParId }),
        credentials: 'include'
      });
    },
    async setEkoId(ekoId) {
      this.eko_id = ekoId;
      await fetch(`${local_url}/set-user-cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eko_id: ekoId }),
        credentials: 'include'
      });
    },
    async setEkoKorime(ekoKorime) {
      this.eko_korime = ekoKorime;
      await fetch(`${local_url}/set-user-cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eko_korime: ekoKorime }),
        credentials: 'include'
      });
    },
    async setUserInfo(userInfo) {
      console.log("Stavljeno: ", userInfo);
      await fetch(`${local_url}/set-user-cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
        credentials: 'include'
      });
    },    
    async clearUserInfo() {
      this.eko_par_id_za = null;
      this.eko_id = null;
      this.eko_korime = null;
      await fetch(`${local_url}/clear-user-cookies`, { 
        method: 'POST',
        credentials: 'include'
      });
    },
  },
  getters: {
    ekoParId: state => state.eko_par_id_za,
    ekoId: state => state.eko_id,
    ekoKorime: state => state.eko_korime
  }
});

