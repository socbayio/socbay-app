async function subscribeUser(authorId) {
    const response = await fetch('/video/author/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorId: authorId }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((err) => console.log('something wrong happened'));
}
