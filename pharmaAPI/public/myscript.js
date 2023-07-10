<script>
  fetch('/medicaments')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('data-container');
      container.innerHTML = JSON.stringify(data);
    })
    .catch(error => console.error(error));
</script>

