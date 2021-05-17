$(document).ready(function () {
    const reportSpan = document.getElementById('reportSpan');
    const reportPopup = document.getElementsByClassName('reportVideo')[0];
    const reportedMain =
        document.getElementsByClassName('reportedVideoMain')[0];
    const reportMain = document.getElementsByClassName('reportVideoMain')[0];
    const bg = document.getElementsByClassName('reportVideoBg')[0];
    const reportBtn = document.getElementById('sendBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    reportSpan.addEventListener('click', function (e) {
        e.preventDefault();

        reportPopup.style.display = 'flex';
        reportMain.style.display = 'flex';
        reportedMain.style.display = 'none';
    });

    bg.addEventListener('click', function (e) {
        e.preventDefault();
        reportPopup.style.display = 'none';
    });

    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        reportPopup.style.display = 'none';
    });

    reportBtn.addEventListener('click', function (e) {
        e.preventDefault();
        reportVideo();
    });
});

function reportVideo() {
    const videoId = document.getElementById('videoId').value;
    const reportType = document.querySelector(
        'input[name="reportType"]:checked'
    ).value;
    const reportCode = document.querySelector('#'+ reportType + ' option:checked').value;
    const descriptions = document.getElementById('description').value;

    const reportInfo = {
        videoId: videoId,
        reportCode: reportCode,
        descriptions: descriptions,
    };

    sendData(reportInfo);
}

function sendData(reportInfo) {
    fetch('/video/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportInfo: reportInfo }),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementsByClassName('reportVideo')[0].style.display =
                'none';
            document.getElementsByClassName(
                'reportedVideoMain'
            )[0].style.display = 'flex';

            console.log(data);
        });
}
