import { ArrowRight, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/cute_dog_and_cat_friends.png";
import { PetCard } from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import { useGetPets } from "@/hooks/use-pets";

export default function Home() {
  const { data, isLoading } = useGetPets({ status: "Available", limit: 3 });
  const featuredPets = data?.pets || [];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-accent/30 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white text-primary font-bold text-sm shadow-sm">
                🐾 Over 2,000 Pets Adopted
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight text-foreground">
                Find your new <br />
                <span className="text-primary relative inline-block">
                  best friend
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 -z-10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Open your heart and home to a rescue pet. Browse our available animals and start the adoption process
                today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/pets">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Adopt a Pet
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-lg bg-white/50 border-primary/20 hover:bg-white text-primary"
                  >
                    Register to Adopt
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white">
                <img src={heroImage} alt="Happy pets" className="w-full h-auto object-cover" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">Featured Pets</h2>
            <p className="text-muted-foreground">These cuties are waiting for a home right now.</p>
          </div>
          <Link to="/pets">
            <Button variant="ghost" className="gap-2 group">
              View all pets
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading featured pets...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              <PetCard key={pet.pet_id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* Categories / Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[2rem] p-8 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Not sure what you're looking for?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              Our advanced search filters help you find the perfect companion based on species, breed, age, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pets?species=Dog">
                <Button variant="secondary" size="lg" className="rounded-full">
                  Dogs
                </Button>
              </Link>
              <Link to="/pets?species=Cat">
                <Button variant="secondary" size="lg" className="rounded-full">
                  Cats
                </Button>
              </Link>
              <Link to="/pets">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  Search All
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <PawPrint className="w-96 h-96 -mr-20 -mb-20" />
          </div>
        </div>
      </section>
    </div>
  );
}
