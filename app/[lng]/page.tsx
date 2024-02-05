import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default async function Home({ params: { lng } }: { params: { lng: string } }) {
  return (
    <main className="h-full w-full bg-no-repeat">
      <div className="flex flex-col">
        <Banner params={{ lng }} />
      </div>
    </main>
  );
}
