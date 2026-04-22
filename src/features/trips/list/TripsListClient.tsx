"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/shared/Button";
import type { TripDto, TripsResponse } from "@/lib/api/trips";

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function useTrips() {
  return useQuery<TripDto[]>({
    queryKey: ["trips"],
    queryFn: () =>
      fetch("/api/trips")
        .then((r) => r.json())
        .then((data: TripsResponse) => data.trips),
  });
}

export function TripsListClient() {
  const {
    data: trips = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTrips();

  return (
    <section>
      {trips.length > 0 && (
        <div className="flex items-center gap-3">
          <Button
            variant="text"
            color="primary"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            Refresh
          </Button>
          <Button href="/trips/new" variant="contained" color="primary">
            New trip
          </Button>
        </div>
      )}
      {isError && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive mt-6 rounded-xl border p-4 text-sm">
          Failed to load trips
        </div>
      )}

      {isLoading ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
          Loading trips...
        </div>
      ) : trips.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
          No trips yet. Create your first trip on the{" "}
          <Link href="/trips/new" className="underline underline-offset-2">
            new trip page
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium text-zinc-900">{trip.title}</h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-zinc-700 capitalize">
                  {trip.status}
                </span>
              </div>

              {trip.description && (
                <p className="mt-2 text-sm text-zinc-700">{trip.description}</p>
              )}

              <div className="mt-3 grid gap-2 text-xs text-zinc-600 sm:grid-cols-2">
                <div>Start: {formatDate(trip.startDate)}</div>
                <div>End: {formatDate(trip.endDate)}</div>
                <div>Created: {formatDate(trip.createdAt)}</div>
                <div className="truncate">ID: {trip.id}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
