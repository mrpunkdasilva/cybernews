export function showScrollFeedback(message: string) {
  // Remove qualquer feedback existente
  const existingFeedback = document.querySelector('.scroll-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  // Cria novo feedback
  const feedback = document.createElement('div');
  feedback.className = 'scroll-feedback';
  feedback.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 9999;
    transform: translateY(-50%);
    font-family: 'Share Tech Mono', monospace;
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
    animation: fadeInOut 1.5s ease-in-out forwards;
  `;
  feedback.textContent = message;

  // Adiciona o elemento ao DOM
  document.body.appendChild(feedback);

  // Remove após a animação
  setTimeout(() => {
    feedback.remove();
  }, 1500);
}