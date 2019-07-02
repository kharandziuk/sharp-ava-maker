const axios = require('axios')
const sharp = require('sharp')
const { expect } = require('chai')
const fs = require('fs')
const { promisify } = require('util')

const solution = (file, height, width) => {
  return file
}


describe('service', () => {
  it('can resize the image', async () => {
    const image = await promisify(fs.readFile)('test/test-image.jpeg')
    const result = await solution(image, 300, 300)
    const { width, height } = await sharp(result).metadata();
    expect(width).equal(300)
    expect(height).equal(300)
  })
})
