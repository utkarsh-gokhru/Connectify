export const setUsername = (username) => {
    return (dispatch) => {
        dispatch({
            type: 'set_username',
            payload: username,
        })
    }
};

export const setEmail = (email) => {
    return (dispatch) => {
        dispatch({
            type: 'set_email',
            payload: email,
        });
    };
};

export const setProfileImage = (image) => {
    return (dispatch) => {
        dispatch({
            type: 'set_profile_image',
            payload: image,
        });
    };
};

export const setBio = (bio) => {
    return (dispatch) => {
        dispatch({
            type: 'set_bio',
            payload: bio,
        });
    };
};

export const setProfileType = (type) => {
    return (dispatch) => {
        dispatch({
            type: 'set_profile_type',
            payload: type,
        });
    };
};
