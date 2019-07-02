const axios = require('axios')
const express = require('express')
const fs = require('fs')
const sharp = require('sharp')
const { expect } = require('chai')
const { promisify } = require('util')
const supertest = require('supertest')

const app = express()

const solution = (file, height, width) => {
  return sharp(file).resize({height, width}).toBuffer()
}

app.post('/resize', (req, res) => {
  const resizer = sharp().resize({height: 300, width: 300}).jpeg()
  req
    .pipe(resizer)
    .pipe(res)
})

describe('service', () => {

  it('can answer', async () => {
    const image = await promisify(fs.readFile)('test/test-image.jpeg')
    const response = await supertest(app)
      .post('/resize')
      .responseType('blob')
      .set('Content-Type', 'image/jpeg')
      .send(image)

    expect(response.statusCode).equal(200)

    const { width, height } = await sharp(response.body).metadata();
    expect(width).equal(300)
    expect(height).equal(300)
  })

})
