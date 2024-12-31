const Config = {
  FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
}

// eslint-disable-next-line no-console
console.log({ Config })

export default Config
