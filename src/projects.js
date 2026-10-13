export function setupProjects() {
const dialog = document.querySelector('.live-dialog');
let lastProjectButton;
document.querySelectorAll('.project-open').forEach(button => button.addEventListener('click', () => {
  const fillpack = button.dataset.project === 'fillpack';
  const url = fillpack ? 'https://fillpackusa.com/' : 'https://mrbl-management-website.replit.app';
  lastProjectButton = button;
  document.getElementById('live-dialog-title').textContent = `${fillpack ? 'FillPack' : 'MRBL'} — the live website`;
  document.getElementById('live-external').href = url;
  dialog.querySelector('iframe').src = url;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { dialog.querySelector('iframe').removeAttribute('src'); document.body.style.overflow = ''; lastProjectButton?.focus({ preventScroll: true }); });

}
