import { SHOW_CONFIRMATION } from '../../constants/common';

const confirmationReducer = (state, action) => {
    switch (action.type) {
        case SHOW_CONFIRMATION:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default confirmationReducer;
