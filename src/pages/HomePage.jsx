import Hero from "../components/Hero.jsx";
import ProductsPage from "./ProductsPage.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="products" className="container my-5">
        <ProductsPage />
      </section>
    </>
  );
}
