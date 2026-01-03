import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import type { Application } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplications } from "@/hooks/use-applications";
import { useCurrentUser } from "@/hooks/use-auth";

const ApplicationRow = ({ application }: { application: Application }) => {
  const pet = application.pet;

  if (!pet) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card/50 gap-4">
        <div className="text-muted-foreground">Pet information unavailable</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors gap-4">
      <div className="flex items-center gap-4">
        <img src={pet.pet_image_url} alt={pet.pet_name} className="w-16 h-16 rounded-lg object-cover" />
        <div>
          <h4 className="font-bold text-lg">{pet.pet_name}</h4>
          <p className="text-sm text-muted-foreground">
            Applied on {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          className={`
            ${
              application.application_status === "Approved"
                ? "bg-green-500"
                : application.application_status === "Rejected"
                  ? "bg-destructive"
                  : "bg-yellow-500 text-yellow-950"
            }
          `}
        >
          {application.application_status}
        </Badge>
        <Link to={`/pets/${pet.pet_id}`}>
          <Button variant="outline" size="sm">
            View Pet
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const user = useCurrentUser();
  const {
    data: applicationsData,
    isLoading,
    refetch,
  } = useGetApplications(user ? { user_id: user.user_id } : undefined);

  const myApplications = applicationsData?.applications || [];

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.user_name}!</p>
        </div>
        <Link to="/pets">
          <Button>Find More Pets</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your adoption requests.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : myApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">You haven't applied for any pets yet.</div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <ApplicationRow key={app.application_id} application={app} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
