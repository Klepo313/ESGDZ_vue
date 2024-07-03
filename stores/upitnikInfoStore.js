import { defineStore } from 'pinia';
import { getTotalAnsweredQuestions, getAnsweredQuestionsForGroup } from '~/services/services';
import Cookies from 'js-cookie';

export const useUpitnikInfoStore = defineStore('upitnik', {
    state: () => ({
        evu_sif: null,
        ezu_id: null,
        ezu_ess_id: null,
        ezu_ezp_id: null,
        ess_id: null,
        ezu_naziv: null,
        ezu_mijenjao: null,
        finished: false,
        totalAnsweredQuestions: { uk_pitanja: 0, uk_odgovoreno: 0 },
        groupAnsweredQuestions: { uk_pitanja: 0, uk_odgovoreno: 0 },
    }),
    actions: {
        async fetchTotalAnsweredQuestions() {
            try {
              const data = await getTotalAnsweredQuestions(this.ezu_id);
              if (data.length > 0) {
                this.totalAnsweredQuestions = {
                  uk_pitanja: parseInt(data[0].uk_pitanja),
                  uk_odgovoreno: parseInt(data[0].uk_odgovoreno),
                };
              }
            } catch (error) {
              console.error('Error fetching total answered questions:', error);
            }
        },
        async fetchAnsweredQuestionsForGroup(groupId) {
          try {
            const data = await getAnsweredQuestionsForGroup(this.ezu_id, groupId);
            if (data.length > 0) {
                this.groupAnsweredQuestions = {
                    uk_pitanja: parseInt(data[0].uk_pitanja),
                    uk_odgovoreno: parseInt(data[0].uk_odgovoreno),
                };
            }
          } catch (error) {
            console.error('Error fetching answered questions for group:', error);
          }
        },
        initializeStore() {
            this.evu_sif = Cookies.get('evu_sif');
            this.ezu_ess_id = Cookies.get('ezu_ess_id');
            this.ezu_id = Cookies.get('evu_id');
            this.ezu_ezp_id = Cookies.get('ezu_ezp_id');
            this.ess_id = Cookies.get('ess_id');
            this.ezu_naziv = Cookies.get('ezu_naziv');
            this.ezu_mijenjao = Cookies.get('ezu_mijenjao');
            this.finished = Cookies.get('finished');
        },
        setEvuSif(evu_sif) {
            this.evu_sif = evu_sif;
            if (process.client) {
                Cookies.set('evu_sif', evu_sif, { expires: 7 }); // Expires in 7 days
            }
        },
        setEzuId(ezu_id) {
            this.ezu_id = ezu_id;
            if (process.client) {
                Cookies.set('evu_id', ezu_id, { expires: 7 });
            }
        },
        setEzuEssId(ezu_ess_id) {
            this.ezu_ess_id = ezu_ess_id;
            if (process.client) {
                Cookies.set('ezu_ess_id', ezu_ess_id, { expires: 7 });
            }
        },
        setEzuEzpId(ezu_ezp_id) {
            this.ezu_ezp_id = ezu_ezp_id;
            if (process.client) {
                Cookies.set('ezu_ezp_id', ezu_ezp_id, { expires: 7 });
            }
        },
        setEssId(ess_id){
            this.ess_id = ess_id;
            if (process.client) {
                Cookies.set('ess_id', ess_id, { expires: 7 });
            }
        },
        setEzuNaziv(ezu_naziv) {
            this.ezu_naziv = ezu_naziv;
            if (process.client) {
                Cookies.set('ezu_naziv', ezu_naziv, { expires: 7 });
            }
        },
        setEzuMijenjao(ezu_mijenjao) {
            this.ezu_mijenjao = ezu_mijenjao;
            if (process.client) {
                Cookies.set('ezu_mijenjao', ezu_mijenjao, { expires: 7 });
            }
        },
        setFinished(finished) {
            this.finished = finished;
            if (process.client) {
                Cookies.set('finished', finished, { expires: 7 });
            }
        },
        clearUpitnikInfo(){
            this.evu_sif = null;
            this.ezu_ess_id = null;
            this.ezu_id = null;
            this.ezu_ezp_id = null;
            this.ess_id = null;
            this.ezu_naziv = null;
            this.ezu_mijenjao = null;
            if (process.client) {
                Cookies.remove('evu_sif');
                Cookies.remove('ezu_ess_id');
                Cookies.remove('evu_id');
                Cookies.remove('ezu_ezp_id');
                Cookies.remove('ess_id');
                Cookies.remove('ezu_naziv');
                Cookies.remove('ezu_mijenjao');
            }
        }
    },
    getters: {
        getEvuSif: state => state.evu_sif,
        getEzuEssId: state => state.ezu_ess_id,
        getEzuId: state => state.ezu_id,
        getEzuEzpId: state => state.ezu_ezp_id,
        getEssId: state => state.ess_id,
        getEzuNaziv: state => state.ezu_naziv,
        getEzuMijenjao: state => state.ezu_mijenjao,
        getFinished: state => state.finished,
    }
});
