export const createServiceWorker = () => {
  navigator.serviceWorker
  .register('/sw.js')
  .then(() => console.info('service worker registered'))
  .catch(error => {
    console.log('ServiceWorker registration failed: ', error)
  })
}
