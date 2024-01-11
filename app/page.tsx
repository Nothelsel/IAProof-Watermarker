import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="h-full w-full bg-no-repeat">
      <div className="flex flex-col">
        <Banner />
        <Footer />
      </div>
    </main>
  );
}
