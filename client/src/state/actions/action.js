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

export const setNotifications = (notifications) => {
    return (dispatch) => {
        dispatch({
            type: 'setNotifications',
            payload: notifications,
        });
    };
};

export const setRequests = (requests) => {
    return (dispatch) => {
        dispatch({
            type: 'setRequests',
            payload: requests,
        });
    };
};

export const setFriends = (friends) => {
    return (dispatch) => {
        dispatch({
            type: 'setFriends',
            payload: friends,
        });
    };
};