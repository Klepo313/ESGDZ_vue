import { defineStore } from 'pinia';
import { getTotalAnsweredQuestions, getAnsweredQuestionsForGroup } from '~/services/services';

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
            this.evu_sif = localStorage.getItem('evu_sif');
            this.ezu_ess_id = localStorage.getItem('ezu_ess_id');
            this.ezu_id = localStorage.getItem('evu_id');
            this.ezu_ezp_id = localStorage.getItem('ezu_ezp_id');
            this.ess_id = localStorage.getItem('ess_id');
            this.ezu_naziv = localStorage.getItem('ezu_naziv');
            this.ezu_mijenjao = localStorage.getItem('ezu_mijenjao');
            this.finished = localStorage.getItem('finished');
        },
        setEvuSif(evu_sif) {
            this.evu_sif = evu_sif;
            if (process.client) {
                localStorage.setItem('evu_sif', evu_sif);
            }
        },
        setEzuId(ezu_id) {
            this.ezu_id = ezu_id;
            if (process.client) {
                localStorage.setItem('evu_id', ezu_id);
            }
        },
        setEzuEssId(ezu_ess_id) {
            this.ezu_ess_id = ezu_ess_id;
            if (process.client) {
                localStorage.setItem('ezu_ess_id', ezu_ess_id);
            }
        },
        setEzuEzpId(ezu_ezp_id) {
            this.ezu_ezp_id = ezu_ezp_id;
            if (process.client) {
                localStorage.setItem('ezu_ezp_id', ezu_ezp_id);
            }
        },
        setEssId(ess_id){
            this.ess_id = ess_id;
            if (process.client) {
                localStorage.setItem('ess_id', ess_id);
            }
        },
        setEzuNaziv(ezu_naziv) {
            this.ezu_naziv = ezu_naziv;
            if (process.client) {
                localStorage.setItem('ezu_naziv', ezu_naziv);
            }
        },
        setEzuMijenjao(ezu_mijenjao) {
            this.ezu_mijenjao = ezu_mijenjao;
            if (process.client) {
                localStorage.setItem('ezu_mijenjao', ezu_mijenjao);
            }
        },
        setFinished(finished) {
            this.finished = finished;
            if (process.client) {
                localStorage.setItem('finished', finished);
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
                localStorage.removeItem('evu_sif');
                localStorage.removeItem('ezu_ess_id');
                localStorage.removeItem('evu_id');
                localStorage.removeItem('ezu_ezp_id');
                localStorage.removeItem('ess_id');
                localStorage.removeItem('ezu_naziv');
                localStorage.removeItem('ezu_mijenjao');
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