import express from 'express'

interface Endpoint {
  register(router: express.Router)
}

export default Endpoint
