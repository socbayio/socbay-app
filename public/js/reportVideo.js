$(document).ready(function () {
    const reportSpan = document.getElementById('reportSpan');
    const popup = document.getElementsByClassName('reportVideo')[0];
    const bg = document.getElementsByClassName('reportVideoBg')[0];
    const reportBtn = document.getElementById('sendBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    reportSpan.addEventListener('click', function (e) {
        popup.style.display = 'flex';
    });

    bg.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    cancelBtn.addEventListener('click', function (e) {
        popup.style.display = 'none';
    });

    reportBtn.addEventListener('click', function (e) {
        e.preventDefault();
        reportVideo();
    });
});

function reportVideo() {
    const videoId = document.getElementById('videoId').value;
    const reportCode = document.querySelector(
        'input[name="reportCode"]:checked'
    ).value;
    const descriptions = document.getElementById('descriptions').value;

    const reportInfo = {
        videoId: videoId,
        reportCode: reportCode,
        descriptions: descriptions,
    };

    console.log(reportInfo);

    fetch('/video/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportInfo: reportInfo }),
    })
        .then((res) => res.json())
        .then((data) => {
            setTimeout(function () {
                document.getElementsByClassName(
                    'reportVideo'
                )[0].style.display = 'none';
            }, 2000);

            console.log(data);
        });
}
