 //Tutorial: https://www.youtube.com/watch?v=SbelQW2JaDQ


 // API Module
 const APIController =(function() {
    const clientId = '2025dd8280bb46ceb8bb28753421fbcf';
    const clientSecret = '5825ecb69bfd408a891c4413d68ddcee';

    //private methods
    const _getToken = async () => {

        const result = await fetch ('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'content-type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories`, {
            method: 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });             

        const data = await result.json()
        console.log(data);
        return data.categories.items;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres() {
            return _getGenres();
        }
    }

 })();

 // UI Module
 const UIController = (function() {

    //References to HTML selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        hfToken: '#hidden_token'
    }

    //public Methods
    return {

        inputField(){
            return {
                genre: document.querySelector(DOMElements.selectGenre)
            }
        },
    

        //Methods to create select list
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },
    }

 })();

 const APPConstroller = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        const token = await APICtrl.getToken();
        UICtrl.storeToken(token);
        const genres = await APICtrl.getGenres(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }
 })(UIController, APIController);

 APPConstroller.init();