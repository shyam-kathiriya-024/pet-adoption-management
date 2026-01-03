import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, CheckCircle2, MapPin, Ruler } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import type { CreateApplicationFormData } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApplication, useGetApplications } from "@/hooks/use-applications";
import { useCurrentUser } from "@/hooks/use-auth";
import { useGetPet } from "@/hooks/use-pets";
import { createApplicationSchema } from "@/lib/validations";

export default function PetDetails() {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch pet details
  const { data: pet, isLoading: petLoading } = useGetPet(id!);

  // Fetch user's applications to check if already applied (only if user is logged in)
  const { data: applicationsData } = useGetApplications(
    user ? { user_id: user.user_id, pet_id: id } : undefined,
    !!user, // Only enable this query when user is logged in
  );

  const createApplication = useCreateApplication();

  const applicationForm = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      pet_id: id || "",
      user_id: user?.user_id || "",
      user_name: user?.user_name || "",
      application_message: "",
    },
  });

  const existingApplication = applicationsData?.applications?.[0];

  const handleAdopt = async (data: CreateApplicationFormData) => {
    if (!user || !id) return;

    try {
      await createApplication.mutateAsync(data);

      setIsDialogOpen(false);
      applicationForm.reset();
      toast.success(`Your request to adopt ${pet?.pet_name} has been sent!`);
    } catch {
      // Error toast is handled by the hook
    }
  };

  if (petLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading pet details...</h1>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pet not found</h1>
        <Link to="/pets">
          <Button>Return to List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/pets">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:pl-0 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Side */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden aspect-square shadow-xl relative">
            <img src={pet.pet_image_url} alt={pet.pet_name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <Badge className={`text-lg px-4 py-1 ${pet.pet_status === "Available" ? "bg-green-500" : "bg-gray-500"}`}>
                {pet.pet_status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details Side */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-heading font-bold text-foreground mb-2">{pet.pet_name}</h1>
            <div className="flex items-center text-muted-foreground text-lg gap-2">
              <MapPin className="h-5 w-5" /> {pet.pet_location}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/30 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground font-medium mb-1">Breed</div>
              <div className="text-lg font-bold">{pet.pet_breed}</div>
            </div>
            <div className="bg-accent/30 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Age
              </div>
              <div className="text-lg font-bold">{pet.pet_age} Years</div>
            </div>
            <div className="bg-accent/30 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground font-medium mb-1 flex items-center gap-1">Gender</div>
              <div className="text-lg font-bold">{pet.pet_gender}</div>
            </div>
            <div className="bg-accent/30 p-4 rounded-xl">
              <div className="text-sm text-muted-foreground font-medium mb-1 flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Size
              </div>
              <div className="text-lg font-bold">{pet.pet_size}</div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 font-heading">About {pet.pet_name}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{pet.pet_description}</p>
          </div>

          <div className="pt-4">
            {!user ? (
              <Link to="/login">
                <Button size="lg" className="w-full text-lg h-12 rounded-full shadow-lg">
                  Log in to Adopt {pet.pet_name}
                </Button>
              </Link>
            ) : existingApplication ? (
              <div className="bg-secondary/20 p-4 rounded-xl border border-secondary text-center">
                <h4 className="font-bold text-secondary-foreground mb-1 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Application {existingApplication.application_status}
                </h4>
                <p className="text-sm text-muted-foreground">
                  You have already applied for this pet on{" "}
                  {new Date(existingApplication.created_at).toLocaleDateString()}.
                </p>
              </div>
            ) : pet.pet_status === "Available" ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full text-lg h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Adopt {pet.pet_name}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adopt {pet.pet_name}</DialogTitle>
                    <DialogDescription>
                      Tell us a little about why you'd be a great home for {pet.pet_name}.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={applicationForm.handleSubmit(handleAdopt)}>
                    <div className="py-4 space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="I have a fenced yard and two other dogs..."
                        className="min-h-32"
                        {...applicationForm.register("application_message")}
                      />
                      {applicationForm.formState.errors.application_message && (
                        <p className="text-sm text-destructive">
                          {applicationForm.formState.errors.application_message.message}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createApplication.isPending}>
                        {createApplication.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button size="lg" disabled className="w-full text-lg h-12 rounded-full opacity-50">
                Not Available
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
