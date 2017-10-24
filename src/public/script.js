console.log('hello from the browser JavaScript')

document.addEventListener('DOMContentLoaded', function() {
  const deleteButtons = document.querySelectorAll('.review-delete-button')

  if (deleteButtons) {
    deleteButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        const reviewID = button.getAttribute('data-id')
        fetch(`/albums/reviews/${reviewID}`, {
          method: 'DELETE',
          credentials: 'same-origin'
        })
          .then(response => {
            console.log(response)
            event.target.parentElement.parentElement.remove()
          })
          .catch(console.error)
      })
    })
  }
})
