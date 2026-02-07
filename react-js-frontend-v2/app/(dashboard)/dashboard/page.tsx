"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Building2,
  FileText,
  Mail,
  Target,
  Loader2,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  GreetingHeader,
  StatCard,
  UpcomingTimeline,
  RecentApplications,
  RingChart,
} from "@/components/dashboard";
import type { TimelineEvent } from "@/components/dashboard";
import { useAuth } from "@/lib/auth-context";
import { getAuthenticatedData } from "@/lib/api";
import type { DashboardData, TimelineEvent as ApiTimelineEvent, Application, University } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [timelineData, appsData, uniData] = await Promise.all([
        getAuthenticatedData<DashboardData[]>("/timeline/user/get"),
        getAuthenticatedData<Application[]>("/applications/user/get"),
        getAuthenticatedData<University[]>("/university/user/get"),
      ]);

      if (timelineData) {
        setDashboardData(timelineData[0]);
      }
      if (appsData && Array.isArray(appsData)) {
        setApplications(appsData);
      }
      if (uniData && Array.isArray(uniData)) {
        setUniversities(uniData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getUniversityName = (universityId: string): string => {
    const university = universities.find((u) => u.id === universityId);
    return university?.name || "Unknown University";
  };

  // Calculate stats from real data
  const totalUniversities = universities.length;
  const submittedApps = applications.filter(
    (app) =>
      app.application_status === "APPLIED" ||
      app.application_status === "ACCEPTED WITH FUND" ||
      app.application_status === "ACCEPTED WITHOUT FULL FUND"
  ).length;

  const stats = [
    {
      title: "Universities Applied",
      value: `${submittedApps}/${totalUniversities}`,
      icon: Building2,
      description: `${totalUniversities} tracked`,
      progress: { current: submittedApps, total: totalUniversities },
      color: "gold" as const,
    },
    {
      title: "Recommendations",
      value: `${dashboardData?.Recommendationcount || 0}`,
      icon: FileText,
      description: "Total LORs",
      color: "primary" as const,
    },
    {
      title: "Faculty Replies",
      value: `${dashboardData?.Repliedmailscount || 0}`,
      icon: Mail,
      description: "Responses received",
      color: "success" as const,
    },
    {
      title: "Applications",
      value: `${dashboardData?.Universityapplicationcount || applications.length}`,
      icon: Target,
      description: "All tracked",
      color: "chart-4" as const,
    },
  ];

  // Process timeline events
  const upcomingEvents = useMemo<TimelineEvent[]>(() => {
    const rawTimeline =
      dashboardData?.Timeline &&
      (JSON.parse(dashboardData?.Timeline as unknown as string) || []);

    if (!rawTimeline || !Array.isArray(rawTimeline)) return [];

    return rawTimeline
      .map((event: ApiTimelineEvent) => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const daysLeft = Math.ceil(
          (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: `${event.type}-${event.date}-${event.name}`,
          type: event.type === "Interview" ? ("interview" as const) : ("deadline" as const),
          title:
            event.type === "Interview"
              ? `Interview with ${event.name}`
              : `${event.name} Deadline`,
          university: event.university_name,
          designation: event.designation,
          date: event.date,
          daysLeft,
          status:
            daysLeft <= 3
              ? ("urgent" as const)
              : daysLeft <= 7
              ? ("upcoming" as const)
              : ("normal" as const),
        };
      })
      .filter((event: TimelineEvent) => event.daysLeft >= 0)
      .sort((a: TimelineEvent, b: TimelineEvent) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [dashboardData?.Timeline]);

  // Get recent applications
  const recentApplications = applications
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4)
    .map((app) => {
      const statusType =
        app.application_status === "APPLIED" ||
        app.application_status === "ACCEPTED WITH FUND"
          ? ("success" as const)
          : app.application_status === "IN PROGRESS" ||
            app.application_status === "PENDING FEE"
          ? ("warning" as const)
          : ("default" as const);

      return {
        id: app.id,
        university: getUniversityName(app.university_id),
        status: app.application_status.replace(/_/g, " "),
        statusType,
        program: app.application_type,
      };
    });

  // Calculate overall progress
  const totalProgress =
    totalUniversities > 0 ? Math.round((submittedApps / totalUniversities) * 100) : 0;

  const userName = user?.name?.split(" ")[0] || "there";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <GreetingHeader
        userName={userName}
        submittedApps={submittedApps}
        totalUniversities={totalUniversities}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            progress={stat.progress}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Events & Applications */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingTimeline events={upcomingEvents} />
          <RecentApplications applications={recentApplications} />
        </div>

        {/* Right Column - Progress Overview */}
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <Card variant="gold">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <RingChart
                  value={submittedApps}
                  total={totalUniversities || 1}
                  label={
                    totalProgress >= 75
                      ? "Excellent Progress!"
                      : totalProgress >= 50
                      ? "Great Progress!"
                      : totalProgress > 0
                      ? "Good Start!"
                      : "Get Started!"
                  }
                  sublabel={`${submittedApps} of ${totalUniversities} submitted`}
                  color="stroke-gold"
                  size="lg"
                />

                <p className="text-sm text-muted-foreground mt-4 max-w-xs">
                  {totalProgress >= 50
                    ? "You're making excellent progress on your applications!"
                    : totalProgress > 0
                    ? "Keep going! Track more applications to complete your journey."
                    : "Start adding universities and applications to track your progress."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Milestones Card */}
          {(submittedApps > 0 ||
            (dashboardData?.Recommendationcount || 0) > 0 ||
            (dashboardData?.Repliedmailscount || 0) > 0) && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" />
                  Milestones
                </h3>
                <div className="space-y-3">
                  {submittedApps > 0 && (
                    <MilestoneItem
                      label="Applications Submitted"
                      value={submittedApps}
                      achieved
                    />
                  )}
                  {(dashboardData?.Recommendationcount || 0) > 0 && (
                    <MilestoneItem
                      label="Recommendations Secured"
                      value={dashboardData?.Recommendationcount || 0}
                      achieved
                    />
                  )}
                  {(dashboardData?.Repliedmailscount || 0) > 0 && (
                    <MilestoneItem
                      label="Faculty Responses"
                      value={dashboardData?.Repliedmailscount || 0}
                      achieved
                    />
                  )}
                  {totalUniversities > 0 && submittedApps < totalUniversities && (
                    <MilestoneItem
                      label="Remaining Applications"
                      value={totalUniversities - submittedApps}
                      achieved={false}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneItem({
  label,
  value,
  achieved,
}: {
  label: string;
  value: number;
  achieved: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-lg font-semibold ${
          achieved ? "text-gold" : "text-muted-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
