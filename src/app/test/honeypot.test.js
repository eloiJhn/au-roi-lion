
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../components/ContactForm";
import { TranslationContext } from "../utils/TranslationContext";

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue("mock-token"),
  }),
}));

const mockShow = jest.fn();
jest.mock("primereact/toast", () => ({
  Toast: React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      show: mockShow,
    }));
    return <div>{props.children}</div>;
  }),
}));

const mockMessages = {
  ContactForm: {
    contact_owner: "Contacter le propriétaire !",
    name_label: "Nom",
    email_label: "Email",
    message_label: "Message",
    sending_in_progress: "Envoi en cours...",
    send_button: "Envoyer",
  },
};

describe("ContactForm honeypot tests", () => {
  let setLastEmailSentTime;
  let setIsSending;
  let setEmailQueue;

  beforeEach(() => {
    setLastEmailSentTime = jest.fn();
    setIsSending = jest.fn();
    setEmailQueue = jest.fn();
    mockShow.mockClear();

    render(
      <TranslationContext.Provider value={{ currentLocale: "fr", messages: mockMessages }}>
        <ContactForm
          lastEmailSentTime={null}
          setLastEmailSentTime={setLastEmailSentTime}
          isSending={false}
          setIsSending={setIsSending}
          emailQueue={[]}
          setEmailQueue={setEmailQueue}
          hideHoneypot={false}
        />
      </TranslationContext.Provider>
    );
  });

  it("bloque la soumission du formulaire si le champ honeypot est rempli", async () => {
    const user = userEvent.setup();

    const honeypotInput = screen.getByLabelText("honeypot");
    await user.type(honeypotInput, "bot-filled-value");

    expect(honeypotInput).toHaveValue("bot-filled-value");

    await user.type(screen.getByLabelText(/Nom/i), "Test User");
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.type(screen.getByLabelText(/Message/i), "Ceci est un message de test.");

    const submitButton = screen.getByRole("button", { name: /Envoyer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          summary: "Erreur",
          detail: "Honeypot détecté, soumission bloquée",
          life: 3000,
          style: { zIndex: 9999 },
        })      
      );
    });

    expect(screen.queryByText("Envoi en cours...")).not.toBeInTheDocument();
  });
});
