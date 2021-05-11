// (function (window, document, undefined) {
//     'use strict';

//     var modal = document.getElementsByClassName('modalDemoWeb')[0];

//     var modalBg = document.getElementsByClassName('modalDemoBg')[0];

//     modalBg.addEventListener('click', function () {
//         console.log('bg clicked');

//         sessionStorage.setItem('disableNotification', true);
//         modal.style.display = 'none';
//     });

//     var disableBtn = document.getElementsByClassName('disable_model_btn')[0];

//     disableBtn.addEventListener('click', function () {
//         console.log('btn clicked');

//         sessionStorage.setItem('disableNotification', true);
//         modal.style.display = 'none';
//     });
// });

console.log('reload page');

//sessionStorage.setItem('disableNotification', false);

var modal = document.getElementsByClassName('modalDemoWeb')[0];

var modalBg = document.getElementsByClassName('modalDemoBg')[0];

modalBg.addEventListener('click', function () {
    console.log('bg clicked');

    sessionStorage.setItem('disableNotification', true);
    modal.style.display = 'none';
});
