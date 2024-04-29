import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold">Bienvenue sur notre site</h1>
      <section className="my-8">
        <h2 className="text-3xl font-bold">Historique de l'appartement</h2>
        <p>Texte détaillant l'historique de l'appartement...</p>
      </section>
      <section className="my-8">
        <h2 className="text-3xl font-bold">Photos</h2>
        <div className="grid grid-cols-3 gap-4">
        </div>
      </section>
      <section className="my-8">
        <h2 className="text-3xl font-bold">Contactez-nous</h2>
        <form>
        </form>
      </section>
    </div>
  );
}
