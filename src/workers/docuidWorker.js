import { WorkerService } from '../service/model/WorkerService';

// Worker listener
onmessage = async function (e) {
    const { action, data } = e.data;

    switch (action) {
        case 'fetchTicDocsuidData':
            console.log("00.0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data)
            const docUidResult = await fetchTicDocsuidData(data.ticDocId, data.par1, data.selectedLanguage, data.token, data.refreshToken);
            postMessage({ action: 'setTicDocsuids', result: docUidResult });
            break;

        case 'fetchAllParsData':
            const parsResult = await fetchAllParsData(data.selectedLanguage, data.token, data.refreshToken);
            postMessage({ action: 'setAllPars', result: parsResult });
            break;

        case 'fetchTicDocsdiscountData':
            const discountResult = await fetchTicDocsdiscountData(data.docsId, data.selectedLanguage, data.token, data.refreshToken);
            postMessage({ action: 'setTicDocsdiscounts', result: discountResult });
            break;

        default:
            console.error(`Unknown action: ${action}`);
    }
};

// Fetch data for TicDocsuid
async function fetchTicDocsuidData(ticDocId, par1, selectedLanguage, token, refreshToken) {
    try {
        const workerService = new WorkerService();
        const data = await workerService.getProdajaLista(ticDocId, par1, selectedLanguage, token, refreshToken);
        console.log("00 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data)
        const sortedData = data.sort((a, b) => {
            if (a.nevent < b.nevent) return -1;
            if (a.nevent > b.nevent) return 1;
            return a.seat - b.seat;
        });

        const updatedData = await Promise.all(sortedData.map(async (item) => {
            const eventatt = await workerService.getTicEventatts11L(item.event, par1, token, refreshToken);
            return {
                ...item,
                eventatt1: eventatt.filter(e => e.code === "11.01."),
                eventatt2: eventatt.filter(e => e.code === "11.02."),
                eventatt3: eventatt.filter(e => e.code === "11.03.")
            };
        }));
        console.log("00.00 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", updatedData)
        return updatedData; // Samo serijalizovani podaci
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fetch data for all Pars
async function fetchAllParsData(selectedLanguage, token, refreshToken) {
    try {
        const workerService = new WorkerService();
        const data = await workerService.getCmnParLista(-1, selectedLanguage, token, refreshToken);
        return data; // Serijalizovani podaci
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fetch data for TicDocsdiscount
async function fetchTicDocsdiscountData(docsId, selectedLanguage, token, refreshToken) {
    try {
        const workerService = new WorkerService();
        const data = await workerService.getTicDocsdiscountLista(docsId, selectedLanguage, token, refreshToken);
        const dataTp = await workerService.getDiscounttpLista(docsId, selectedLanguage, token, refreshToken);
        
        const dataDD = dataTp.map(({ text, id }) => ({ name: text, code: id }));
        const updatedData = data.map(item => {
            const matchedTpItem = dataDD.find(ddItem => ddItem.code === item.discount);
            return {
                ...item,
                ddTicTpItem: matchedTpItem || null
            };
        });
        
        return updatedData; // Samo serijalizovani podaci
    } catch (error) {
        console.error(error);
        return [];
    }
}
