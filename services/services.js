import axios from 'axios';
import pLimit from 'p-limit';

const limit = pLimit(5); // Ograničenje na 5 istovremenih konekcija

const public_url = 'https://esgdz-server.onrender.com';
//const local_url = 'http://localhost:5000';
const local_url = 'http://app.agrambanka.hr:5000';


export async function getVrsteUpitnika() {
    try {
        const response = await limit(() => axios.get(`${local_url}/upitnici`));
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnici(userName, firmId){
    try {
        const response = await limit(() => axios.get(`${local_url}/upitnici/${userName}/${parseInt(firmId)}`));
        return response.data;
    } catch (error) {
        console.error('Pogreška prilikom dohvaćanja upitnika:', error);
        throw new Error('Pogreška prilikom dohvaćanja upitnika');
    }
}

export async function getUpitnikData(esg_sif){
    try {
        const response = await limit(() => axios.get(`${local_url}/struktura/${esg_sif}`));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getGroupsData(ess_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/groups/${ess_id}`));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getQuestionsForGroup(epu_id, ess_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/questions/${epu_id}/${ess_id}`));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAnswersForUpitnik(p_ezu_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/odg/${p_ezu_id}`))
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function setValueForAnswer(p_eou_id, p_vrijednost, p_kor_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/save-answer`, {
            params: {
                p_eou_id,
                p_vrijednost,
                p_kor_id
            }
        }));
        return response.data.rezultat;
    } catch (error) {
        console.error('Error saving answer:', error);
        throw error;
    }
};

export async function createNewUpitnik(p_kor_id, p_evu_sif){
    try {
        const response = await limit(() => axios.get(`${local_url}/create-upitnik`, {
            params: {
                p_kor_id,
                p_evu_sif
            }
        }));
        return response.data.dodano;
    } catch (error) {
        console.error('Error creating upitnik:', error);
        throw error;
    }
}

export async function getTotalAnsweredQuestions(p_ezu_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/totalAnswered/${p_ezu_id}`))
        return response.data;
    } 
    catch (err){
        console.error('Error getting total answered questions:', err);
        throw err;
    }
}

export async function getAnsweredQuestionsForGroup(p_ezu_id, p_ess_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/answeredPerGroup/${p_ezu_id}/${p_ess_id}`))
        return response.data;
    } 
    catch (err){
        console.error('Error getting total answered questions:', err);
        throw err;
    }
}

export async function getStatusUpitnika(p_ezu_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/status/${p_ezu_id}`));
        return response.data;
    } catch (error) {
        console.error('Error getting status upitnika:', error);
        throw error;
    }
}

export async function lockUpitnik(p_ezu_id){
    try {
        const response = await limit(() => axios.post(`${local_url}/lock-upitnik/${p_ezu_id}`));
        return response.data;
    } catch (error) {
        console.error('Error locking upitnik:', error);
        throw error;
    }
}

export async function checkIfAnswerIsAnswered(p_eou_id){
    try {
        const response = await limit(() => axios.get(`${local_url}/check-answer/${p_eou_id}`));
        return response.data;
    } catch (error) {
        console.error('Error checking if answer is already answered:', error);
        throw error;
    }
}

export async function getOrderedIDs(){
    try {
        const response = await limit(() => axios.get(`${local_url}/ordered-ids`));
        return response.data;
    } catch (error) {
        console.error('Error checking if IDs are not ordered: ', error);
        throw error;
    }
}