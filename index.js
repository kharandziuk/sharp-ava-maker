const axios = require('axios')

describe('server', () => {
  it('can upload image inside of request and receive avatar in base64', async () => {
    await file = axios.get(
      faker.image.imageUrl(400,400,"people")
    )
    console.log(file)
  })
})
