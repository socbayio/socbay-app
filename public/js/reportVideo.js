$(document).ready(function () {
    const reportSpan = document.getElementById('reportSpan');
    const popup = document.getElementsByClassName('reportVideo')[0];

    reportSpan.addEventListener('click', function (e) {
        console.log('report span clicked');
        popup.style.display = 'flex';
    });
});

function reportVideo(videoId, reportId, descriptions) {}
