import { SAVE_USER } from "../Action/Action";
const InitialState = {
    users: [],
}

function userReducer(state = InitialState, action) {
    switch (action.type) {
        case SAVE_USER:
            return { ...state, users: action.data };
        default:
            return state;
    }
}

export default userReducer;