$(document).ready(function () {
    const reportSpan = document.getElementById('reportSpan');
    const reportPopup = document.getElementsByClassName('reportVideo')[0];
    const reportedMain = document.getElementsByClassName('reportedVideoMain')[0];
    const reportMain = document.getElementsByClassName('reportVideoMain')[0];
    const bg = document.getElementsByClassName('reportVideoBg')[0];
    const reportBtn = document.getElementById('sendBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    const reasonRadioInputs = document.querySelectorAll('.reportType');

    reasonRadioInputs.forEach((item) => {
        item.addEventListener('click', function (e) {
            // Hide all selects
            document.querySelectorAll('.reportSelect').forEach((item) => {
                item.style.display = 'none';
            });
            // Display chosen input select
            document.getElementsByClassName('report' + this.value)[0].style.display = 'block';
        });
    });

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

    reportBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const report = validateDataChosen();

        document.getElementById('reportNotif').style.display = 'none';
        if (!report) {
            document.getElementById('reportNotif').style.display = 'flex';
            return;
        }

        const reportInfo = {
            videoId: document.getElementById('videoId').value,
            reportCode: report.reportCode,
            descriptions: report.descriptions,
        };

        const result = await sendData(reportInfo);

        if (result.success === 'OK') {
            document.getElementsByClassName('reportVideoMain')[0].style.display = 'none';
            document.getElementsByClassName('reportedVideoMain')[0].style.display = 'flex';
        } else {
            document.getElementsByClassName('reportVideo')[0].style.display = 'none';
        }
    });
});

function validateDataChosen() {
    const reportInfo = {
        reportCode: '',
        descriptions: '',
    };

    // Get chosen radio for report type
    const chosenOption = document.querySelector('input[name="reportType"]:checked');
    if (!chosenOption) return null;

    const reportType = chosenOption.value;
    const reportDesc = document.getElementById('reportDesc').value;

    // Report type: 'other'
    if (reportType === 'other') {
        const otherReasonValue = document.getElementById(reportType).value;

        // return null if other reason is not specified
        if (otherReasonValue === '') return null;

        reportInfo.reportCode = reportType;
        reportInfo.descriptions = otherReasonValue + '|' + reportDesc;
    }

    // Report type: 'not other'
    if (reportType !== 'other') {
        const selectedReasonValue = document.getElementById(reportType).value;

        // return null if no reason selected
        if (selectedReasonValue === 'notselected') return null;

        reportInfo.reportCode = reportType + '_' + selectedReasonValue;
        reportInfo.descriptions = reportDesc;
    }

    // Return
    return reportInfo;
}

function sendData(reportInfo) {
    return new Promise((resolve, reject) => {
        fetch('/video/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportInfo: reportInfo }),
        })
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
            .catch((e) => reject(e));
    });
}
