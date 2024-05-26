import axios from 'axios';

export async function getVrsteUpitnika() {
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/upitnici`);
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnici(userName, firmId){
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/upitnici/${userName}/${parseInt(firmId)}`);
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnikData(esg_sif){
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/struktura/${esg_sif}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getGroupsData(ess_id){
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/groups/${ess_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getQuestionsForGroup(epu_id, ess_id){
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/questions/${epu_id}/${ess_id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAnswersForUpitnik(p_ezu_id){
    try {
        const response = await axios.get(`https://esgdz-server.onrender.com/odg/${p_ezu_id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function setValueForAnswer(p_eou_id, p_vrijednost, p_kor_id){
    try {
        const response = await axios.get('https://esgdz-server.onrender.com/save-answer', {
            params: {
                p_eou_id,
                p_vrijednost,
                p_kor_id
            }
        });
        return response.data.rezultat;
    } catch (error) {
        console.error('Error saving answer:', error);
        throw error;
    }
};

export async function createNewUpitnik(p_kor_id, p_evu_sif){
    try {
        const response = await axios.get('https://esgdz-server.onrender.com/create-upitnik', {
            params: {
                p_kor_id,
                p_evu_sif
            }
        });
        return response.data.dodano;
    } catch (error) {
        console.error('Error creating upitnik:', error);
        throw error;
    }
}