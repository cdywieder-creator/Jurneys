export function setupContact(arrow) {
const form = document.getElementById('inquiry-form');
const status = document.getElementById('form-status');
const download = document.getElementById('download-inquiry');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.innerHTML = 'Sending…';
  status.textContent = '';
  download.hidden = true;
  try {
    const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (response.status === 503 || response.status === 404) {
      status.textContent = 'Inquiry delivery is not connected yet. Your message has not been sent. You can save it below.';
      download.hidden = false;
    } else {
      if (!response.ok) throw new Error('Unable to send your inquiry. Please try again.');
      status.textContent = 'Thanks for reaching out. Your inquiry has been sent.';
      form.reset();
    }
  } catch {
    status.textContent = 'Your message could not be sent. Please try again, or save your inquiry below.';
    download.hidden = false;
  } finally {
    button.disabled = false;
    button.innerHTML = `Let's talk about your website ${arrow}`;
  }
});
download.addEventListener('click', () => {
  const data = Object.fromEntries(new FormData(form));
  const blob = new Blob([`JOURNEYS — WEBSITE INQUIRY\n\nName: ${data.name}\nEmail: ${data.email}\nBusiness: ${data.business || '—'}\n\n${data.message}\n`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'journeys-inquiry.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});


}
