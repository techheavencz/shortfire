import express from 'express'

function respondWith(res: express.Response, body: unknown) {
    res.status(200);
    res.set('content-type', 'application/json');
    if (body !== undefined && body !== null) {
        res.send(JSON.stringify(body));
    } else {
        res.send()
    }
}

function respondFailure(res: express.Response, status: number, message: string, errors: unknown = null) {
    res.status(status);
    res.json({
        status: status,
        message: message,
        errors: errors
    });
}

export {respondWith, respondFailure}
