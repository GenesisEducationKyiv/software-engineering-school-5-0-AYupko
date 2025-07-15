document.getElementById('subscriptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const city = document.getElementById('city').value;
  const frequency = document.getElementById('frequency').value;

  try {
    const response = await fetch('http://backend:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, city, frequency })
    });

    if (response.ok) {
      document.getElementById('successMsg').style.display = 'block';
      document.getElementById('errorMsg').style.display = 'none';
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    document.getElementById('successMsg').style.display = 'none';
    document.getElementById('errorMsg').style.display = 'block';
  }
});
