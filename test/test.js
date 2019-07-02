const axios = require('axios')
const express = require('express')
const fs = require('fs')
const sharp = require('sharp')
const { expect } = require('chai')
const { promisify } = require('util')
const supertest = require('supertest')
const domain = require('domain')

const app = express()

const solution = (file, height, width) => {
  return sharp(file).resize({height, width}).toBuffer()
}


app.post('/resize/:height/:width', (req, res) => {
  const d = domain.create()
  d.run(() => {
  const { height, width } = req.params
  const resizer = sharp().resize({
    height: Number(height),
    width: Number(height)
  }).jpeg()
  req
    .pipe(resizer)
    .pipe(res)
  })
  d.on('error', (e) => {
    console.log(e)
    res.sendStatus(400)
  })
})

describe('service', () => {

  it('can answer', async () => {
    const image = await promisify(fs.readFile)('test/test-image.jpeg')
    const response = await supertest(app)
      .post('/resize/300/300')
      .responseType('blob')
      .set('Content-Type', 'image/jpeg')
      .send(image)

    expect(response.statusCode).equal(200)

    const { width, height } = await sharp(response.body).metadata();
    expect(width).equal(300)
    expect(height).equal(300)
  })

  it('can answer', async () => {
    const response = await supertest(app)
      .post('/resize/300/300')
      .responseType('blob')
      .set('Content-Type', 'image/jpeg')
      .send('bbb')

    expect(response.statusCode).equal(400)

  })

})
