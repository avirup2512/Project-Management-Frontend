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
        console.log(globalDispatch);
        
        if (globalDispatch) {
            globalDispatch(true);
        }
        const response = await originalFetch(...args);
        console.log("Ended");
        if (globalDispatch) {
            globalDispatch(false);
        }
        return response;
    } catch (error) {
            if (globalDispatch) {
            //globalDispatch(setShowLoader(false));
        }
        console.error('Fetch error:', resource, error);
        throw error;
    }
}