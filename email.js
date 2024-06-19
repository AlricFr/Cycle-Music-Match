import { renderTemplate } from "./uiHandler.js";

function initEmail() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init({
      publicKey: "nVmv3hlegRfCDbY07",
    });
    console.log("Email started")
};

function register(){
    initEmail();
    const obj = {
        email: document.getElementById('email').value,
    }
    emailjs.send('service_3o95v0a', 'template_zw4gfws', obj)
            .then(() => {
                console.log('SUCCESS!');
                renderTemplate("main","registration-creation-success", null);
                window.localStorage.setItem("registered", true);
            }, (error) => {
                console.log('FAILED...', error);
            });
}

export { register, initEmail };
