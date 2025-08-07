import { setShowLoader } from '../AppSlice';

let globalDispatch = null;
export const setGlobalDispatch = (dispatchFn) => {
    globalDispatch = dispatchFn;
}

let globalDispatcPayload = null;
export const setGlobalDispatchPayload = (dispatchPayload) => {
    globalDispatcPayload = dispatchPayload;
}

const originalFetch = window.fetch;
window.fetch = async (...args) => {
    console.log("Started");
    try {        
        if (globalDispatch) {
            globalDispatch(true);
        }
        const response = await originalFetch(args[0],args[1]);
        console.log("Ended");
        if (globalDispatch) {
            globalDispatch(false);
        }
        return response;
    } catch (error) {
            if (globalDispatch) {
                globalDispatch(false);
            }
        console.error('Fetch error:', error);
        throw error;
    }
}