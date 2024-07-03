import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    eko_par_id_za: null,
    eko_id: null,
    eko_korime: null
  }),
  actions: {
    initializeStore() {
      if (process.client) {
        this.eko_par_id_za = Cookies.get('eko_par_id_za');
        this.eko_id = Cookies.get('eko_id');
        this.eko_korime = Cookies.get('eko_korime');
      }
    },
    setEkoParId(ekoParId) {
      this.eko_par_id_za = ekoParId;
      if (process.client) {
        Cookies.set('eko_par_id_za', ekoParId, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      }
    },
    setEkoId(ekoId) {
      this.eko_id = ekoId;
      if (process.client) {
        Cookies.set('eko_id', ekoId, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      }
    },
    setEkoKorime(ekoKorime) {
      this.eko_korime = ekoKorime;
      if (process.client) {
        Cookies.set('eko_korime', ekoKorime, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      }
    },
    clearUserInfo() {
      this.eko_par_id_za = null;
      this.eko_id = null;
      this.eko_korime = null;
      if (process.client) {
        Cookies.remove('eko_par_id_za');
        Cookies.remove('eko_id');
        Cookies.remove('eko_korime');
      }
    },
  },
  getters: {
    ekoParId: state => state.eko_par_id_za,
    ekoId: state => state.eko_id,
    ekoKorime: state => state.eko_korime
  }
});
