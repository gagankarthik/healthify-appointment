import Image from "next/image";
import Hero from "./_components/Hero";
import CategorySearch from "./_components/CategorySearch";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Reviews from "./_components/Reviews";
import Subscribe from "./_components/Subscribe";
import Stats from "./_components/Stats";

export default function Home() {
  return (
   <div>
    <Header />
    <Hero/>
    <CategorySearch/>
    <Stats/>
    <Reviews/>
    <Subscribe/>
    <Footer />
    </div>
  );
}
