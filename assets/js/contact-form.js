

  (function () {
    emailjs.init('mosyBz7sAhDjmcMB2');
  })();

  const form = document.getElementById("contactForm");
  const button = document.getElementById("submitBtn");

  document.onload(() => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  });
   

  form.addEventListener("submit", function (event) {
      event.preventDefault();
      button.disabled = true;
      button.innerHTML = "Sending...";
      const serviceID = "service_oppg3kr";
      const templateID = "template_ebraw3g";

      // send the email here
      emailjs.sendForm(serviceID, templateID, this).then(
        (response) => {
          document.getElementById("formMessage").style.display = "block";
          setTimeout(() => {
            document.getElementById("formMessage").style.display = "none";
          }, 4000);
          console.log("SUCCESS!", response.status, response.text);
          button.innerHTML = "Send";
          button.disabled = false;
          form.reset();
        },
        (error) => {
          console.log("FAILED...", error);
          alert("FAILED...", error);
          form.reset();
          button.innerHTML = "Send";
          button.disabled = false;
        }
      );
    });
  
  // document.getElementById("contactForm").addEventListener("submit", async function (event) {
  //   event.preventDefault(); // Prevent default form submission behavior

  //   const form = event.target;

  //   // Extract form data
  //   const formData = new FormData(form);

  //   // Convert form data to an object for easier processing
  //   const data = Object.fromEntries(formData.entries());

  //   const isFrench = window.location.pathname.includes("/me-contacter")

  //   const message = {
  //     serverError: isFrench
  //     ? "Une erreur s'est produite lors de l'envoi. Veuillez réessayer."
  //     : "An error occurred while sending the form. Please try again.",
  //     networkError: isFrench
  //     ? "Une erreur de connexion s'est produite. Veuillez vérifier votre réseau."
  //     : "A network error occurred. Please check your connection.",
  //   }

  //   try {
  //     // Send the form data to the webhook
  //     const response = await fetch("https://hook.eu1.make.com/fl8ope3mw1rjydd505kxgr0en4k2zotn", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.ok) {
  //       // Show success message
  //       document.getElementById("formMessage").style.display = "block";
  //       form.reset(); // Optionally reset the form
  //     } else {
  //       // Handle server errors
  //       alert(messages.serverError);
  //     }
  //   } catch (error) {
  //     // Handle network errors
  //     alert(messages.networkError);
  //   }
  // });