import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CreatePetFormData } from "@/lib/validations";
import type { Application } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useCreatePet, useDeletePet, useGetPets, useUpdatePet } from "@/hooks/use-pets";
import { createPetSchema } from "@/lib/validations";

const ApplicationRow = ({ application }: { application: Application }) => {
  const updateStatus = useUpdateApplicationStatus();
  const pet = application.pet;

  const handleStatusUpdate = async (newStatus: "Approved" | "Rejected") => {
    try {
      await updateStatus.mutateAsync({
        id: application.application_id,
        data: { application_status: newStatus },
      });
      toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
    } catch {
      // Error toast is handled by the hook
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 bg-card/50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{application.user_name}</span>
          <span className="text-muted-foreground">wants to adopt</span>
          <span className="font-bold text-primary">{pet?.pet_name || "Unknown Pet"}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Applied on {new Date(application.created_at).toLocaleDateString()}
        </p>
        <p className="bg-accent/50 p-2 rounded text-sm italic">"{application.application_message}"</p>
      </div>

      <div className="flex items-center gap-2">
        {application.application_status === "Pending" ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => handleStatusUpdate("Approved")}
              disabled={updateStatus.isPending}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={updateStatus.isPending}
            >
              Reject
            </Button>
          </>
        ) : (
          <Badge
            variant="outline"
            className={
              application.application_status === "Approved"
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
            }
          >
            {application.application_status}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: applicationsData, isLoading: applicationsLoading, refetch: refetchApplications } = useGetApplications();
  const { data: petsData, isLoading: petsLoading } = useGetPets({ limit: 100 });
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const petForm = useForm<CreatePetFormData>({
    resolver: zodResolver(createPetSchema),
    defaultValues: {
      pet_name: "",
      pet_species: "Dog",
      pet_breed: "",
      pet_age: 0,
      pet_gender: "Male",
      pet_size: "Medium",
      pet_description: "",
      pet_image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      pet_status: "Available",
      pet_location: "",
    },
  });

  const applications = applicationsData?.applications || [];
  const pets = petsData?.pets || [];
  const pendingCount = applications.filter((a) => a.application_status === "Pending").length;

  const handleRefresh = async () => {
    await refetchApplications();
  };

  const handleAddPet = async (data: CreatePetFormData) => {
    try {
      await createPetMutation.mutateAsync(data);
      setIsAddPetOpen(false);
      petForm.reset();
    } catch {
      // Error toast is handled by the hook
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    try {
      await deletePetMutation.mutateAsync(id);
    } catch {
      // Error toast is handled by the hook
    }
  };

  const handleUpdatePetStatus = async (id: string, status: "Available" | "Pending" | "Adopted") => {
    try {
      await updatePetMutation.mutateAsync({
        id,
        data: { pet_status: status },
      });
    } catch {
      // Error toast is handled by the hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage pets and applications.</p>
        </div>

        <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add New Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a New Pet</DialogTitle>
            </DialogHeader>
            <form onSubmit={petForm.handleSubmit(handleAddPet)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input {...petForm.register("pet_name")} />
                    {petForm.formState.errors.pet_name && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Breed *</Label>
                    <Input {...petForm.register("pet_breed")} />
                    {petForm.formState.errors.pet_breed && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_breed.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label>Species *</Label>
                    <Controller
                      name="pet_species"
                      control={petForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {petForm.formState.errors.pet_species && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_species.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Age *</Label>
                    <Input type="number" {...petForm.register("pet_age", { valueAsNumber: true })} />
                    {petForm.formState.errors.pet_age && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_age.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Controller
                      name="pet_gender"
                      control={petForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {petForm.formState.errors.pet_gender && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_gender.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Size *</Label>
                    <Controller
                      name="pet_size"
                      control={petForm.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Small">Small</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {petForm.formState.errors.pet_size && (
                      <p className="text-sm text-destructive">{petForm.formState.errors.pet_size.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input {...petForm.register("pet_location")} />
                  {petForm.formState.errors.pet_location && (
                    <p className="text-sm text-destructive">{petForm.formState.errors.pet_location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input {...petForm.register("pet_description")} />
                  {petForm.formState.errors.pet_description && (
                    <p className="text-sm text-destructive">{petForm.formState.errors.pet_description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Image URL *</Label>
                  <Input {...petForm.register("pet_image_url")} />
                  {petForm.formState.errors.pet_image_url && (
                    <p className="text-sm text-destructive">{petForm.formState.errors.pet_image_url.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createPetMutation.isPending}>
                {createPetMutation.isPending ? "Adding..." : "Save Pet"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="applications">
        <TabsList className="mb-8">
          <TabsTrigger value="applications">Applications ({pendingCount} Pending)</TabsTrigger>
          <TabsTrigger value="pets">Manage Pets</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Adoption Requests</CardTitle>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={applicationsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${applicationsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : applications.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No applications yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <ApplicationRow key={app.application_id} application={app} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          {petsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div key={pet.pet_id} className="relative group">
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDeletePet(pet.pet_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="h-48 overflow-hidden">
                      <img src={pet.pet_image_url} className="w-full h-full object-cover" alt={pet.pet_name} />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold">{pet.pet_name}</h3>
                        <Badge variant="outline">{pet.pet_status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        {pet.pet_breed} • {pet.pet_age} yrs
                      </p>

                      <Select
                        value={pet.pet_status}
                        onValueChange={(val: "Available" | "Pending" | "Adopted") =>
                          handleUpdatePetStatus(pet.pet_id, val)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Adopted">Adopted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
