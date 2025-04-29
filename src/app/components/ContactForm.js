import React from "react";
import { useState, useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { TranslationContext } from "../utils/TranslationContext";

export function ContactForm({
  lastEmailSentTime,
  setLastEmailSentTime,
  isSending,
  setIsSending,
  hideHoneypot = true,
}) {
  const toast = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    message: "",
    honeypot: "",
  });

  const { currentLocale, messages } = useContext(TranslationContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validation côté client avant soumission
  const validateForm = () => {
    // Validation simple du nom (2-50 caractères)
    if (!formData.from_name || formData.from_name.trim().length < 2 || formData.from_name.trim().length > 50) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur de validation",
        detail: messages.ContactForm?.invalid_name || "Le nom doit contenir entre 2 et 50 caractères",
        life: 3000,
      });
      return false;
    }

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.reply_to || !emailRegex.test(formData.reply_to)) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur de validation",
        detail: messages.ContactForm?.invalid_email || "Veuillez entrer une adresse email valide",
        life: 3000,
      });
      return false;
    }

    // Validation simple du message (1-5000 caractères)
    if (!formData.message || formData.message.trim().length < 1 || formData.message.trim().length > 5000) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur de validation",
        detail: messages.ContactForm?.invalid_message || "Le message doit contenir entre 1 et 5000 caractères",
        life: 3000,
      });
      return false;
    }

    return true;
  };

  // Référence à un drapeau pour éviter les soumissions multiples
  const isSubmitting = useRef(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    // Prévenir les doubles soumissions
    if (isSubmitting.current || isSending) {
      return;
    }
    isSubmitting.current = true;

    // Validation du formulaire côté client
    if (!validateForm()) {
      isSubmitting.current = false;
      return;
    }

    if (!executeRecaptcha) {
      toast.current?.show({
        severity: "error",
        summary: messages.ContactForm?.recaptcha_not_available || "Exécution de recaptcha non disponible pour le moment",
        detail: "Vérifiez que vous n'utilisez pas de bloqueur de publicités et réessayez.",
        life: 3000,
      });
      isSubmitting.current = false;
      return;
    }

    if (formData.honeypot) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: messages.ContactForm?.honeypot_detected || "Honeypot détecté, soumission bloquée",
        life: 3000,
        style: { zIndex: 9999 }
      });
      isSubmitting.current = false;
      return;
    }

    const currentTime = new Date().getTime();
    const delay = 60000;

    if (lastEmailSentTime && currentTime - lastEmailSentTime < delay) {
      toast.current?.show({
        severity: "info",
        summary: "Information ",
        detail: messages.ContactForm?.wait_one_minute || "Vous devez attendre une minute avant d'envoyer un autre message.",
        life: 3000,
      });
      isSubmitting.current = false;
      return;
    }

    setIsSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let token;
      try {
        token = await executeRecaptcha("submit_form");
      } catch (recaptchaError) {
        console.error("ReCAPTCHA execution error:", recaptchaError);
        toast.current?.show({
          severity: "error",
          summary: "Erreur ReCAPTCHA",
          detail: "Erreur lors de la vérification ReCAPTCHA. Vérifiez que vous n'utilisez pas de bloqueur de publicités.",
          life: 3000,
        });
        setIsSending(false);
        isSubmitting.current = false;
        return;
      }

      // Création d'un objet avec des données sanitisées
      const sanitizedData = {
        from_name: formData.from_name.trim(),
        reply_to: formData.reply_to.trim(),
        message: formData.message.trim(),
      };

      const recaptchaResponse = await fetch("/api/validate-recaptcha", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"  // Protection CSRF additionnelle
        },
        body: JSON.stringify({ token }),
      });

      if (!recaptchaResponse.ok) {
        const errorData = await recaptchaResponse.json();
        throw new Error(errorData.error || messages.ContactForm?.recaptcha_failed || "La validation reCAPTCHA a échoué");
      }

      const emailResponse = await fetch("/api/send-email-nodemailer", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Utiliser le token comme authentification
          "X-Requested-With": "XMLHttpRequest"  // Protection CSRF additionnelle
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!emailResponse.ok) {
        throw new Error(messages.ContactForm?.email_send_failed || "Échec de l'envoi du message");
      }

      toast.current?.show({
        severity: "success",
        summary: currentLocale === "fr" ? "Succès" : "Success",
        detail: messages.ContactForm?.email_sent || "Message envoyé avec succès!",
        life: 3000,
      });

      setLastEmailSentTime(currentTime);
      setFormData({
        from_name: "",
        reply_to: "",
        message: "",
        honeypot: "",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: error.message || messages.ContactForm?.email_send_failed || "Échec de l'envoi du message",
        life: 3000,
      });
    } finally {
      setIsSending(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div id="contact-form" className="mt-20 p-8 mx-auto max-w-4xl">
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{
          fontFamily: "'Merienda One', cursive",
          background: "linear-gradient(to right, #003E50, #5AA088)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "underline",
          textDecorationColor: "#003E50",
        }}
      >
        {messages.ContactForm?.contact_owner || "Contacter le propriétaire !"}
      </h1>
      <form onSubmit={handleSendEmail} className="space-y-6">
        <input
          type="text"
          name="honeypot"
          aria-label="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          style={
            hideHoneypot
              ? {
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  height: 0,
                  width: 0,
                }
              : {}
          }
          tabIndex="-1"
          autoComplete="off"
        />
        <div className="flex flex-col">
          <label
            htmlFor="from_name"
            className="text-sm font-medium"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {messages.ContactForm?.name_label || "Nom"}
          </label>
          <input
            type="text"
            name="from_name"
            id="from_name"
            value={formData.from_name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md hover:border-[#FFD700] focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50 transition-all duration-300"
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="reply_to"
            className="text-sm font-medium"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {messages.ContactForm?.email_label || "Email"}
          </label>
          <input
            type="email"
            name="reply_to"
            id="reply_to"
            value={formData.reply_to}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md hover:border-[#FFD700] focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50 transition-all duration-300"
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="text-sm font-medium"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {messages.ContactForm?.message_label || "Message"}
          </label>
          <textarea
            name="message"
            id="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md hover:border-[#FFD700] focus:border-[#FFD700] focus:ring focus:ring-[#FFD700] focus:ring-opacity-50 transition-all duration-300"
            required
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 border text-base font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 hover:ring-2 hover:ring-[#FFD700] transition-all duration-300"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              border: "none",
              color: "white",
              padding: "1px",
            }}
            disabled={isSending}
          >
            <span
              style={{
                display: "block",
                background: "linear-gradient(to right, #003E50, #5AA088)",
                borderRadius: "inherit",
                padding: "10px 24px",
                color: "white",
              }}
              className="hover:bg-gradient-to-r hover:from-[#003E50] hover:to-[#FFD700] transition-all duration-300"
            >
              {isSending
                ? messages.ContactForm?.sending_in_progress || "Envoi en cours..."
                : messages.ContactForm?.send_button || "Envoyer"}
            </span>
          </button>
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
}