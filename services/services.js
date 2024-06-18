import axios from 'axios';

const public_url = 'https://esgdz-server.onrender.com';
const local_url = 'http://localhost:5000';

export async function getVrsteUpitnika() {
    try {
        const response = await axios.get(`${local_url}/upitnici`);
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnici(userName, firmId){
    try {
        const response = await axios.get(`${local_url}/upitnici/${userName}/${parseInt(firmId)}`);
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnikData(esg_sif){
    try {
        const response = await axios.get(`${local_url}/struktura/${esg_sif}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getGroupsData(ess_id){
    try {
        const response = await axios.get(`${local_url}/groups/${ess_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getQuestionsForGroup(epu_id, ess_id){
    try {
        const response = await axios.get(`${local_url}/questions/${epu_id}/${ess_id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAnswersForUpitnik(p_ezu_id){
    try {
        const response = await axios.get(`${local_url}/odg/${p_ezu_id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function setValueForAnswer(p_eou_id, p_vrijednost, p_kor_id){
    try {
        const response = await axios.get(`${local_url}/save-answer`, {
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
        const response = await axios.get(`${local_url}/create-upitnik`, {
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