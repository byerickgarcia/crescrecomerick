document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // LÓGICA DO SCROLL REVEAL
    // =====================================
    
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    
    // Função para verificar se o elemento está visível
    const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        // O elemento é considerado visível se estiver dentro do viewport, 
        // com uma margem de 100px para aparecer mais cedo.
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 100
        );
    };

    // Função que aplica a classe 'visible'
    const revealElements = () => {
        elementsToReveal.forEach(element => {
            if (isVisible(element)) {
                element.classList.add('visible');
            }
        });
    };

    // Adiciona o listener de scroll e chama a função imediatamente
    window.addEventListener('scroll', revealElements);
    window.addEventListener('resize', revealElements);
    revealElements(); // Executa ao carregar a página

    // =====================================
    // LÓGICA DO FORMULÁRIO DE CONVERSÃO
    // =====================================

    const form = document.getElementById('signup-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // NOTA: Em um projeto real, você faria uma requisição AJAX (Fetch API) 
        // para um endpoint de backend ou serviço de e-mail marketing aqui.

        // Simulação de Sucesso no Envio
        formMessage.textContent = 'Agendamento Recebido com Sucesso! Em breve entrarei em contato via WhatsApp.';
        formMessage.style.color = 'var(--color-secondary)'; // Usando a cor de destaque do CSS
        formMessage.style.display = 'block';

        // Limpa o formulário
        form.reset();

        // Esconde a mensagem após 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
});
