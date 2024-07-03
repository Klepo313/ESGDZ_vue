// middleware/auth.js
import Cookies from 'js-cookie';

export default defineNuxtRouteMiddleware((to, from, next) => {
    if (process.client) {
      const ekoParId = Cookies.get('eko_par_id_za');
    const ekoId = Cookies.get('eko_id');
    const ekoKorime = Cookies.get('eko_korime');
      
      if (!ekoParId || !ekoId || !ekoKorime) {
        return next('/login');
      }
    } else {
      return next();
    }
  });
  