export async function sharePublication(id, t) {
  try {
    await navigator.share({
      title: 'Publication in Magergram',
      url: `${window.location.origin}/post/${id}`
    })
  } catch (e) {
    alert(t('Your browser or device not supported share'));
    console.error('Wrong shared publication', e);
  }
}
