import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import type { PetQueryParams } from "@/types/api.types";
import { PetCard } from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGetPets } from "@/hooks/use-pets";

export default function PetListing() {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<"All" | "Dog" | "Cat" | "Other">("All");
  const [ageRange, setAgeRange] = useState([0, 20]);
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  // Use debouncedSearchTerm to avoid firing requests on every keystroke
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const queryParams: PetQueryParams = {
    search: debouncedSearchTerm || undefined,
    species: speciesFilter,
    minAge: ageRange[0],
    maxAge: ageRange[1],
    page: currentPage,
    limit: 6,
  };

  // Fetch pets with filters
  const { data, isLoading } = useGetPets(queryParams);
  const pets = data?.pets || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSpeciesFilter("All");
    setAgeRange([0, 20]);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Filters</h3>

            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or breed..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on search
                  }}
                  className="pl-9"
                />
              </div>

              {/* Species */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Species</label>
                <Select
                  value={speciesFilter}
                  onValueChange={(value: "All" | "Dog" | "Cat" | "Other") => {
                    setSpeciesFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Species</SelectItem>
                    <SelectItem value="Dog">Dogs</SelectItem>
                    <SelectItem value="Cat">Cats</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Age</label>
                  <span className="text-sm text-muted-foreground">
                    {ageRange[0]} - {ageRange[1]} yrs
                  </span>
                </div>
                <Slider
                  value={ageRange}
                  onValueChange={(value) => {
                    setAgeRange(value);
                    setCurrentPage(1);
                  }}
                  max={20}
                  step={1}
                  className="py-4"
                />
              </div>

              <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                Reset Filters <X className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2">Available Pets</h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `Found ${pagination?.total || 0} pets looking for a home.`}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Loading pets...</h3>
              <p className="text-muted-foreground">Please wait while we fetch the pets.</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-bold mb-2">No pets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pets.map((pet) => (
                  <PetCard key={pet.pet_id} pet={pet} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 font-medium">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
