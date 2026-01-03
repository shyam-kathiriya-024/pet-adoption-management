import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { Pet } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-none shadow-md">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={pet.pet_image_url}
          alt={pet.pet_name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-8 w-8 bg-white/80 hover:bg-white text-destructive"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge
            variant={pet.pet_status === "Available" ? "default" : "secondary"}
            className={pet.pet_status === "Available" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {pet.pet_status}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading text-xl font-bold">{pet.pet_name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.pet_breed} • {pet.pet_age} yrs
            </p>
          </div>
          <span className="text-xl">{pet.pet_species === "Dog" ? "🐕" : pet.pet_species === "Cat" ? "🐈" : "🐾"}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin className="h-3 w-3" />
          {pet.pet_location}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/pets/${pet.pet_id}`} className="w-full">
          <Button className="w-full rounded-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
