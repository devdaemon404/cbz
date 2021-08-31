module.exports = {
  env: {
    V2_API_URL: process.env.NODE_ENV === 'development' ? 'https://dev.app.cloudsbuzz.in:3000' : 'https://test.app.cloudsbuzz.in',
    V1_API_URL: 'https://test.app.cloudsbuzz.in'
  }
};