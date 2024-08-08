// Initial state
const initialState = {
    username: '',
    email: '',
    profileImage: null,
    bio: '',
    profileType: 'Public', // Default value
};

// Reducer function
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'set_username':
            return {
                ...state,
                username: action.payload,
            };

        case 'set_email':
            return {
                ...state,
                email: action.payload,
            };

        case 'set_profile_image':
            return {
                ...state,
                profileImage: action.payload,
            };

        case 'set_bio':
            return {
                ...state,
                bio: action.payload,
            };

        case 'set_profile_type':
            return {
                ...state,
                profileType: action.payload,
            };

        default:
            return state;
    }
};

export default userReducer;
