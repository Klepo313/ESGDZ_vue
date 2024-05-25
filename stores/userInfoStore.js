import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    eko_par_id_za: null,
    eko_id: null,
    eko_korime: null
  }),
  actions: {
    initializeStore() {
      if (process.client) {
        this.eko_par_id_za = localStorage.getItem('eko_par_id_za');
        this.eko_id = localStorage.getItem('eko_id');
        this.eko_korime = localStorage.getItem('eko_korime');
      }
    },
    setEkoParId(ekoParId) {
      this.eko_par_id_za = ekoParId;
      if (process.client) {
        localStorage.setItem('eko_par_id_za', ekoParId);
      }
    },
    setEkoId(ekoId) {
      this.eko_id = ekoId;
      if (process.client) {
        localStorage.setItem('eko_id', ekoId);
      }
    },
    setEkoKorime(ekoKorime) {
      this.eko_korime = ekoKorime;
      if (process.client) {
        localStorage.setItem('eko_korime', ekoKorime);
      }
    },
    clearUserInfo() {
      this.eko_par_id_za = null;
      this.eko_id = null;
      this.eko_korime = null;
      if (process.client) {
        localStorage.removeItem('eko_par_id_za');
        localStorage.removeItem('eko_id');
        localStorage.removeItem('eko_korime');
      }
    },
  },
  getters: {
    ekoParId: state => state.eko_par_id_za,
    ekoId: state => state.eko_id,
    ekoKorime: state => state.eko_korime
  }
});



// import { defineStore } from 'pinia';

// export const useUserInfoStore = defineStore('userInfo', {
//     state: () => ({
//         eko_par_id_za: process.client ? localStorage.getItem('eko_par_id_za') : null,
//         eko_id: process.client ? localStorage.getItem('eko_id') : null,
//         eko_korime: process.client ? localStorage.getItem('eko_korime') : null
//     }),
//     actions: {
//         setEkoParId(ekoParId) {
//             this.eko_par_id_za = ekoParId;
//             if (process.client) {
//                 localStorage.setItem('eko_par_id_za', ekoParId);
//             }
//         },
//         setEkoId(ekoId) {
//             this.eko_id = ekoId;
//             if (process.client) {
//                 localStorage.setItem('eko_id', ekoId);
//             }
//         },
//         setEkoKorime(ekoKorime) {
//             this.eko_korime = ekoKorime;
//             if (process.client) {
//                 localStorage.setItem('eko_korime', ekoKorime);
//             }
//         },
//         clearUserInfo() {
//             this.eko_par_id_za = null;
//             this.eko_id = null;
//             this.eko_korime = null;
//             if (process.client) {
//                 localStorage.removeItem('eko_par_id_za');
//                 localStorage.removeItem('eko_id');
//                 localStorage.removeItem('eko_korime');
//             }
//         }
//     },
//     getters: {
//         ekoParId: state => state.eko_par_id_za,
//         ekoId: state => state.eko_id,
//         ekoKorime: state => state.eko_korime
//     }
// });



// // // Pratimo promjene u localStorageState i ažuriramo globalStore
// // localStorageState.eko_par_id_za.watch(value => {
// //     useGlobalStore.setEkoParId(value);
// // });
// // localStorageState.eko_id.watch(value => {
// //     useGlobalStore.setEkoId(value);
// // });
// // localStorageState.eko_korime.watch(value => {
// //     useGlobalStore.setEkoKorime(value);
// // });

// // export const useGlobalStore = defineStore('global', {
// //     state: () => ({
// //         eko_par_id_za: localStorageState.value.eko_par_id_za,
// //         eko_id: localStorageState.value.eko_id,
// //         eko_korime: localStorageState.value.eko_korime
// //     }),
// //     actions: {
// //         setEkoParId(ekoParId) {
// //             localStorageState.eko_par_id_za = ekoParId;
// //         },
// //         setEkoId(ekoId){
// //             localStorageState.eko_id = ekoId;
// //         },
// //         setEkoKorime(ekoKorime){
// //             localStorageState.eko_korime = ekoKorime;
// //         }
// //     },
// //     getters: {
// //         getEkoParId() {
// //             return this.eko_par_id_za;
// //         },
// //         getEkoId() {
// //             return this.eko_id;
// //         },
// //         getEkoKorime() {
// //             return this.eko_korime;
// //         }
// //     }
// // });

// // export const useGlobalStore = defineStore('global', {
// //   state: () => ({
// //     eko_par_id_za: Number,
// //     eko_id: Number,
// //     eko_korime: String
// //   }),
// //   actions: {
// //     setEkoParId(ekoParId) {
// //       this.eko_par_id_za = ekoParId;
// //       localStorageState.value = this.$state;
// //     },
// //     setEkoId(ekoId){
// //         this.eko_id = ekoId;
// //         localStorageState.value = this.$state;
// //     },
// //     setEkoKorime(ekoKorime){
// //         this.eko_korime = ekoKorime;
// //         localStorageState.value = this.$state;
// //     }
// //   },
// //   getters: {
// //     getEkoParId() {
// //       return this.eko_par_id_za;
// //     },
// //     getEkoId() {
// //       return this.eko_id;
// //     },
// //     getEkoKorime() {
// //       return this.eko_korime;
// //     }
// //   }
// // });
