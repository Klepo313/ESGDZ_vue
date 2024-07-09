// import { createStore } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

// const store = createStore({
//     plugins: [
//         createPersistedState({
//             key: 'aezakmi',
//             storage: window.sessionStorage,
//             paths: ['eko_par_id_za', 'eko_id', 'eko_korime']
//         })
//     ],
//     state() {
//         return {
//             eko_par_id_za: null,
//             eko_id: null,
//             eko_korime: ''
//         }
//     },
//     mutations: {
//         setEkoParId(state, ekoParId) {
//             state.eko_par_id_za = ekoParId;
//         },
//         setEkoId(state, ekoId) {
//             state.eko_id = ekoId;
//         },
//         setEkoKorime(state, ekoKorime) {
//             state.eko_korime = ekoKorime;
//         }
//     },
//     getters: {
//         getEkoParId(state) {
//             return state.eko_par_id_za;
//         },
//         getEkoId(state) {
//             return state.eko_id;
//         },
//         getEkoKorime(state) {
//             return state.eko_korime;
//         }
//     }
// })

// export default store;

// // import { defineStore, createPinia, setActivePinia } from "pinia"
// // import { useStorage } from '@vueuse/core';

// // const pinia = createPinia()

// // setActivePinia(pinia);

// // // Hook za spremanje stanja u localStorage
// // //const localStorageState = useStorage('pinia_state', pinia.state);

// // const localStorageState = useStorage('pinia_state', () => ({
// //     eko_par_id_za: null,
// //     eko_id: null,
// //     eko_korime: null
// // }));

// // const reactiveState = reactive({
// //     eko_par_id_za: localStorageState.eko_par_id_za,
// //     eko_id: localStorageState.eko_id,
// //     eko_korime: localStorageState.eko_korime
// // });

// // export const useGlobalStore = defineStore('global', () => ({
// //     state: () => reactiveState,
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
// //             return localStorageState.eko_par_id_za;
// //         },
// //         getEkoId() {
// //             return localStorageState.eko_id;
// //         },
// //         getEkoKorime() {
// //             return localStorageState.eko_korime;
// //         }
// //     }
// // }));

// // // Pratimo promjene u localStorageState i ažuriramo globalStore
// // // Pratimo promjene u localStorageState i ažuriramo globalStore

// // watchEffect(() => {
// //     useGlobalStore.setEkoParId(localStorageState.eko_par_id_za);
// //     useGlobalStore.setEkoId(localStorageState.eko_id);
// //     useGlobalStore.setEkoKorime(localStorageState.eko_korime);
// // });



// // // // Pratimo promjene u localStorageState i ažuriramo globalStore
// // // localStorageState.eko_par_id_za.watch(value => {
// // //     useGlobalStore.setEkoParId(value);
// // // });
// // // localStorageState.eko_id.watch(value => {
// // //     useGlobalStore.setEkoId(value);
// // // });
// // // localStorageState.eko_korime.watch(value => {
// // //     useGlobalStore.setEkoKorime(value);
// // // });

// // // export const useGlobalStore = defineStore('global', {
// // //     state: () => ({
// // //         eko_par_id_za: localStorageState.value.eko_par_id_za,
// // //         eko_id: localStorageState.value.eko_id,
// // //         eko_korime: localStorageState.value.eko_korime
// // //     }),
// // //     actions: {
// // //         setEkoParId(ekoParId) {
// // //             localStorageState.eko_par_id_za = ekoParId;
// // //         },
// // //         setEkoId(ekoId){
// // //             localStorageState.eko_id = ekoId;
// // //         },
// // //         setEkoKorime(ekoKorime){
// // //             localStorageState.eko_korime = ekoKorime;
// // //         }
// // //     },
// // //     getters: {
// // //         getEkoParId() {
// // //             return this.eko_par_id_za;
// // //         },
// // //         getEkoId() {
// // //             return this.eko_id;
// // //         },
// // //         getEkoKorime() {
// // //             return this.eko_korime;
// // //         }
// // //     }
// // // });

// // // export const useGlobalStore = defineStore('global', {
// // //   state: () => ({
// // //     eko_par_id_za: Number,
// // //     eko_id: Number,
// // //     eko_korime: String
// // //   }),
// // //   actions: {
// // //     setEkoParId(ekoParId) {
// // //       this.eko_par_id_za = ekoParId;
// // //       localStorageState.value = this.$state;
// // //     },
// // //     setEkoId(ekoId){
// // //         this.eko_id = ekoId;
// // //         localStorageState.value = this.$state;
// // //     },
// // //     setEkoKorime(ekoKorime){
// // //         this.eko_korime = ekoKorime;
// // //         localStorageState.value = this.$state;
// // //     }
// // //   },
// // //   getters: {
// // //     getEkoParId() {
// // //       return this.eko_par_id_za;
// // //     },
// // //     getEkoId() {
// // //       return this.eko_id;
// // //     },
// // //     getEkoKorime() {
// // //       return this.eko_korime;
// // //     }
// // //   }
// // // });

export default defineNuxtPlugin(() => {});