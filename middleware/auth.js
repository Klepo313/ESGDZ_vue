// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from, next) => {
    if (process.client) {
      const ekoParId = localStorage.getItem('eko_par_id_za');
      const ekoId = localStorage.getItem('eko_id');
      const ekoKorime = localStorage.getItem('eko_korime');
      
      if (!ekoParId || !ekoId || !ekoKorime) {
        return next('/login');
      }
    } else {
      return next();
    }
  });
  