const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function subscribeUser(sendSubscription) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      if (!registration.pushManager) {
        console.warn('Push manager unavailable');
        return;
      }

      registration.pushManager.getSubscription().then(function (existedSubscription) {
        if (existedSubscription === null) {
          console.warn('No subscription detected, make a request');
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true
          }).then(function (newSubscription) {
            console.warn('New subscription added.');
            sendSubscription({
              variables: {
                subscription: JSON.stringify(newSubscription)
              }
            });
          }).catch(function (e) {
            if (Notification.permission !== 'granted') {
              console.warn('Permission was not granted.');
            } else {
              console.error('An error ocurred during the subscription process', e);
            }
          })
        } else {
          console.warn('Existed subscription detected.');
          sendSubscription({
            variables: {
              subscription: JSON.stringify(existedSubscription)
            }
          });
        }
      })
    }).catch(function (e) {
      console.error('An error ocurred during Service Worker registration', e);
    })
  }
}
