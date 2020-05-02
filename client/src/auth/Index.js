export const signup = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json()
    })
    .catch(err => console.log(err));
};

export const signin = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json()
    })
    .catch(err => console.log(err));
};


export const authenticate = (jwt, callback) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(jwt))
        callback();
    }
};

export const signout = (callback) => {
    // if we have window then we can access the localstorage
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
    }
    callback();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
        .then(response => {
            console.log("signout ", response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};