import { createMocks } from "node-mocks-http";
import { POST as sendEmailRoute } from "../api/send-email-nodemailer/route";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("POST /api/send-email", () => {
  beforeAll(() => {
    process.env.SENDGRID_API_KEY = 'test-api-key';
    process.env.FROM_EMAIL = 'from@example.com';
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  it("devrait envoyer un email avec des données valides", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: "Email envoyé avec succès" }),
    });

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: (header) => {
          const headers = { "Content-Type": "application/json" };
          return headers[header];
        },
      },
      body: JSON.stringify({
        from_name: "Test User",
        reply_to: "test@example.com",
        message: "Ceci est un message de test.",
      }),
    });

    req.json = async () => JSON.parse(req.body);

    const response = await sendEmailRoute(req);

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "Email envoyé avec succès" });
  });
  
  it("devrait retourner une erreur si les champs requis sont manquants", async () => {
    const { req } = createMocks({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: (header) => {
          const headers = { "Content-Type": "application/json" };
          return headers[header];
        }
      },
      body: JSON.stringify({}),
    });

    req.json = async () => JSON.parse(req.body);

    const response = await sendEmailRoute(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toEqual({ message: "Champs requis manquants" });
  });

  it("devrait retourner une erreur si l'email est invalide", async () => {
    const { req } = createMocks({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: (header) => {
          const headers = { "Content-Type": "application/json" };
          return headers[header];
        }
      },
      body: JSON.stringify({
        from_name: "Test User",
        reply_to: "invalid-email",
        message: "Ceci est un message de test.",
      }),
    });

    req.json = async () => JSON.parse(req.body);

    const response = await sendEmailRoute(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toEqual({ message: "Adresse email invalide" });
  });

  it("devrait retourner une erreur si le contenu est détecté comme spam", async () => {
    const { req } = createMocks({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: (header) => {
          const headers = { "Content-Type": "application/json" };
          return headers[header];
        }
      },
      body: JSON.stringify({
        from_name: "Spammer",
        reply_to: "spammer@example.com",
        message: "Achetez maintenant ce produit exclusif !",
      }),
    });
  
    req.json = async () => JSON.parse(req.body);
  
    const response = await sendEmailRoute(req);
  
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ message: "Le contenu est détecté comme spam" });
  });

  it("devrait respecter la limite de débit (rate limiting)", async () => {
    fetch.mockResolvedValue({ ok: true, status: 200 });
    
    for (let i = 0; i < 6; i++) {
  
      let token = `test-token-user1`;  
    
      const { req } = createMocks({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          get: (header) => {
            const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
            return headers[header];
          }
        },
        body: JSON.stringify({
          from_name: "Test User",
          reply_to: "test@example.com",
          message: "Ceci est un message de test.",
        }),
      });
    
      req.json = async () => JSON.parse(req.body);
    
      try {
        const response = await sendEmailRoute(req);
        
        if (i < 5) { 
          expect(response.status).toBe(200);
          
          const data = await response.json();
          expect(data).toEqual({ message: "Email envoyé avec succès" });
        } else { 
          expect(response.status).toBe(429);
    
          const data = await response.json();
          expect(data).toEqual({ message: "Trop de requêtes" });
        }
      } catch (error) {
        console.error(`Error at iteration ${i + 1}:`, error.message);
        if (i >= 5) {
          expect(error.message).toBe("Too Many Requests");
        } else {
          throw error; 
        }
      }  
    }  
  });
});
