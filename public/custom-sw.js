self.addEventListener('push', event => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon,
    vibrate: data.vibrate
  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})
