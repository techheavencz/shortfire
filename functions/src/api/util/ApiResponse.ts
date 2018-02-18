import * as express from 'express'

function respondWith(res: express.Response, body: any) {
  res.status(200);
  res.set('content-type', 'application/json');
  if (body !== undefined && body !== null) {
    res.send(JSON.stringify(body));
  } else {
    res.send()
  }
}

function respondFailure(res: express.Response, status: number, message: string) {
  res.status(status);
  res.set('content-type', 'application/json');
  res.send(JSON.stringify({
    status: status,
    message: message
  }))
}

export {respondWith, respondFailure}