function displaySubscribeButton(userInfo) {
    document.getElementById('subscribeBtn').style.display = 'none';
    document.getElementById('subscribedBtn').style.display = 'none';

    if (userInfo) {
        console.log(userInfo);
        console.log(userInfo.authorSubscribed);
        if (!userInfo.authorSubscribed) {
            document.getElementById('subscribeBtn').style.display = 'block';
            return;
        }
    }

    console.log('unsubscribed');
    document.getElementById('subscribedBtn').style.display = 'block';
}

async function subscribeUser(authorId) {
    await fetch('/video/author/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId: authorId }),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('subscribeBtn').style.display = 'none';
            document.getElementById('subscribedBtn').style.display = 'block';

            console.log(data);
            return data;
        })
        .catch((err) => console.log('something wrong happened'));
}

async function unsubscribeUser(authorId) {
    await fetch('/video/author/unsubscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId: authorId }),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('subscribeBtn').style.display = 'block';
            document.getElementById('subscribedBtn').style.display = 'none';

            console.log(data);
            return data;
        })
        .catch((err) => console.log('something wrong happened'));
}
