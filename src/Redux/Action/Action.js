export const SAVE_USER = 'SAVE_USER';

export function loginUser(item) {
    return {
        type: SAVE_USER,
        data: item
    }
}