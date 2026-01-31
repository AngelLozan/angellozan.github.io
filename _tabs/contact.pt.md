---
lang: pt
page_id: contact
permalink: /contact-me
title: Contato
icon: fas fa-envelope
order: 5
---
<div class="contact-page">

  <p>
   Por favor, entre em contato comigo, ficarei feliz em discutir vários projetos, ideias e oportunidades. Responderei o mais breve possível 🙏
  </p>
  <form id="contactForm">
    <label for="name" data-bs-toggle="tooltip" data-bs-placement="left" title="Obrigatório">Nome*:</label>
    <input type="text" id="name" name="name" required />

    <label for="email" data-bs-toggle="tooltip" data-bs-placement="left" title="Obrigatório">Email*:</label>
    <input type="email" id="email" name="email" required />

    <label for="subject" data-bs-toggle="tooltip" data-bs-placement="left" title="Obrigatório">Assunto*:</label>
    <input type="text" name="subject" id="subject" required />
    
    <label for="message" data-bs-toggle="tooltip" data-bs-placement="left" title="Obrigatório">Mensagem*:</label>
    <textarea id="message" name="message" rows="5" required></textarea>

    <div class="d-flex justify-content-center" data-bs-toggle="tooltip" data-bs-placement="left" title="Obrigatório">
      <div class="g-recaptcha" data-sitekey="6LcTroUnAAAAAM1HpSVBQjjcjRKuSxDJLr7R7rlS" data-theme="dark"></div>
    </div>
    <br/>

    <button id="submitBtn" type="submit">Enviar</button>
  </form>

  <!-- Message container for feedback -->
  <div id="formMessage" style="display: none; margin-top: 1rem; color: green;">
    Sua mensagem foi enviada com sucesso!
  </div>
</div>

<script src="{{ '/assets/js/contact-form.js' | relative_url }}"></script>
