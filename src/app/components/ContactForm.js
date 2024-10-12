import { useState, useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { TranslationContext } from "../utils/TranslationContext";

export function ContactForm({
  lastEmailSentTime,
  setLastEmailSentTime,
  isSending,
  setIsSending,
  emailQueue,
  setEmailQueue,
}) {
  const toast = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    message: "",
    honeypot: "", // Nouveau champ honeypot
  });
  const { currentLocale, messages, switchLanguage } =
    useContext(TranslationContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    // Vérification du honeypot
    if (formData.honeypot) {
      console.log("Honeypot détecté, soumission bloquée");
      return;
    }

    const currentTime = new Date().getTime();
    const delay = 60000; // 1 minute en millisecondes

    if (lastEmailSentTime && currentTime - lastEmailSentTime < delay) {
      setEmailQueue((prevQueue) => [...prevQueue, formData]);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail:
          "Vous devez attendre une minute avant d'envoyer un autre message.",
        life: 3000,
      });
      return;
    }

    setIsSending(true);

    try {
      // Exécution de reCAPTCHA
      const token = await executeRecaptcha("submit_form");

      // Validation reCAPTCHA
      const recaptchaResponse = await fetch("/api/validate-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!recaptchaResponse.ok) {
        throw new Error(
          `reCAPTCHA validation failed: ${recaptchaResponse.statusText}`
        );
      }

      const recaptchaData = await recaptchaResponse.json();
      if (!recaptchaData.success) {
        throw new Error("reCAPTCHA validation failed");
      }

      // Envoi de l'email via la nouvelle route API
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }

      const result = await emailResponse.json();

      console.log("Email sent:", result.message);
      toast.current.show({
        severity: "success",
        summary: "Succès",
        detail: "Message envoyé avec succès!",
        life: 3000,
      });

      setLastEmailSentTime(currentTime);
      if (emailQueue.length > 0) {
        sendBatchedEmails();
      }

      setFormData({
        from_name: "",
        reply_to: "",
        message: "",
        honeypot: "", // Réinitialisation du honeypot
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: error.message || "Échec de l'envoi du message",
        life: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendBatchedEmails = async () => {
    try {
      const response = await fetch("/api/send-batch-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailQueue),
      });

      if (!response.ok) {
        throw new Error("Failed to send batched emails");
      }

      const result = await response.json();

      console.log("Batched emails sent:", result.message);
      toast.current.show({
        severity: "success",
        summary: "Succès",
        detail: "Messages en attente envoyés avec succès!",
        life: 3000,
      });
      setEmailQueue([]);
    } catch (error) {
      console.error("Failed to send batched emails:", error);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de l'envoi des messages en attente",
        life: 3000,
      });
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
        {/* Champ honeypot caché */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          style={{ display: "none" }}
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
            {messages.ContactForm?.message_labe || "Message"}
          </label>
          <textarea
            name="message"
            id="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 border text-base font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
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
            >
              {isSending
                ? messages.ContactForm?.sending_in_progress ||
                  "Envoi en cours..."
                : messages.ContactForm?.send_button || "Envoyer"}
            </span>
          </button>
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
}
