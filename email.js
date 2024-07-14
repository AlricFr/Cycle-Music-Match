(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init({
      publicKey: "nVmv3hlegRfCDbY07",
    });
})();

function register(){
    const obj = {
        email: document.getElementById('email').value,
    }
    emailjs.send('service_3o95v0a', 'template_zw4gfws', obj)
            .then(() => {
                console.log('SUCCESS!');
            }, (error) => {
                console.log('FAILED...', error);
            });
}