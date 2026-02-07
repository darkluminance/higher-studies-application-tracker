"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Loader2,
  Building2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  getAuthenticatedData,
  postAuthenticatedData,
} from "@/lib/api";
import type { RecommenderStatus, Application, Recommender } from "@/lib/types";

export default function LORStatusPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [recommenderStatuses, setRecommenderStatuses] = useState<RecommenderStatus[]>([]);
  const [universityName, setUniversityName] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const body = { application_id: applicationId };
      const [statusesData, nameData, appsData, recommendersData] = await Promise.all([
        postAuthenticatedData<{ application_id: string }, RecommenderStatus[]>(
          "/recommendation_status/university/get",
          body
        ),
        postAuthenticatedData<{ application_id: string }, string>(
          "/recommendation_status/university/name/get",
          body
        ),
        getAuthenticatedData<Application[]>("/applications/user/get"),
        getAuthenticatedData<Recommender[]>("/recommenders/user/get"),
      ]);

      if (Array.isArray(statusesData)) {
        setRecommenderStatuses(statusesData);
      }
      if (typeof nameData === "string") {
        setUniversityName(nameData);
      }
      if (appsData && Array.isArray(appsData)) {
        const app = appsData.find((a) => a.id === applicationId);
        if (app) {
          setApplication(app);
        }
      }
      if (recommendersData && Array.isArray(recommendersData)) {
        setRecommenders(recommendersData);
      }
    } catch (error) {
      console.error("Failed to fetch LOR status:", error);
      toast.error("Failed to load recommendation status");
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRecommenderName = (recommenderId: string): string => {
    const recommender = recommenders.find((r) => r.id === recommenderId);
    return recommender?.name || "Unknown Recommender";
  };

  const getRecommenderEmail = (recommenderId: string): string => {
    const recommender = recommenders.find((r) => r.id === recommenderId);
    return recommender?.email || "";
  };

  const getRecommenderInstitution = (recommenderId: string): string => {
    const recommender = recommenders.find((r) => r.id === recommenderId);
    return recommender?.institution || "";
  };

  const handleToggleSubmitted = async (status: RecommenderStatus) => {
    setUpdatingId(status.id);
    const newValue = !status.is_lor_submitted;

    try {
      await postAuthenticatedData("/recommendation_status/university/update", {
        id: status.id,
        is_lor_submitted: newValue,
      });

      setRecommenderStatuses((prev) =>
        prev.map((s) =>
          s.id === status.id ? { ...s, is_lor_submitted: newValue } : s
        )
      );

      toast.success(
        newValue ? "LOR marked as submitted" : "LOR marked as pending"
      );
    } catch (error) {
      console.error("Failed to update LOR status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const submittedCount = recommenderStatuses.filter((s) => s.is_lor_submitted).length;
  const totalCount = recommenderStatuses.length;
  const progressPercentage = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-serif font-semibold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Recommendation Letters
          </h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {universityName || "Application"}
          </p>
        </div>
        <Link href="/dashboard/applications">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">LOR Progress</h3>
              <p className="text-sm text-muted-foreground">
                {submittedCount} of {totalCount} letters submitted
              </p>
            </div>
            <div className="text-3xl font-serif font-semibold text-primary">
              {progressPercentage}%
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommenders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-chart-4" />
          Recommenders ({totalCount})
        </h2>

        {recommenderStatuses.length > 0 ? (
          <div className="grid gap-4">
            {recommenderStatuses.map((status) => {
              const isSubmitted = status.is_lor_submitted;
              const isUpdating = updatingId === status.id;

              return (
                <Card
                  key={status.id}
                  className={`transition-all hover:shadow-lg group ${
                    isSubmitted ? "border-success/30 bg-success/5" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleSubmitted(status)}
                        disabled={isUpdating}
                        className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        ) : isSubmitted ? (
                          <CheckCircle2 className="w-8 h-8 text-success cursor-pointer hover:scale-110 transition-transform" />
                        ) : (
                          <Circle className="w-8 h-8 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all" />
                        )}
                      </button>

                      {/* Recommender Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {status.name || getRecommenderName(status.recommender_id)}
                          </h3>
                          <Badge
                            variant={isSubmitted ? "default" : "secondary"}
                            className={
                              isSubmitted
                                ? "bg-success/10 text-success border-success/20"
                                : ""
                            }
                          >
                            {isSubmitted ? "Submitted" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {getRecommenderEmail(status.recommender_id)}
                        </p>
                        {getRecommenderInstitution(status.recommender_id) && (
                          <p className="text-sm text-muted-foreground truncate">
                            {getRecommenderInstitution(status.recommender_id)}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleSubmitted(status)}
                          >
                            {isSubmitted ? (
                              <>
                                <Circle className="w-4 h-4 mr-2" />
                                Mark as Pending
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Submitted
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <UserCheck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommenders Assigned</h3>
              <p className="text-muted-foreground mb-4">
                This application doesn&apos;t have any recommenders assigned yet.
              </p>
              <Button asChild>
                <Link href={`/dashboard/applications`}>
                  Edit Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      {recommenderStatuses.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Application Status: <strong>{application?.application_status?.replace(/_/g, " ") || "Unknown"}</strong>
              </span>
              <span className="text-muted-foreground">
                Application Type: <strong>{application?.application_type || "Unknown"}</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
