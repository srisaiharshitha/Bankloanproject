
    document.getElementById('contactForm').addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      if(!name || !phone){
        alert('Please fill required fields: Name and Phone');
        return;
      }
      alert('Thanks ' + name + '! Your request has been received. Ticket #' + Math.floor(100000 + Math.random()*900000));
      this.reset();
    });
  