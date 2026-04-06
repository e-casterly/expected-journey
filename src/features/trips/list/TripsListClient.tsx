"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export function TripsListClient() {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTrips() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/trips", { method: "GET" });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message ?? "Failed to load trips");
      }

      const payload = (await response.json()) as TripsResponse;
      setTrips(payload.trips);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load trips",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTrips();
  }, []);

  return (
    <div className="container">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Your trips</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Trips are loaded from `GET /api/trips`.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="text"
              color="primary"
              disabled={isLoading}
              onClick={() => void loadTrips()}
            >
              Refresh
            </Button>
            <Link
              href="/trips/new"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary/90"
            >
              New trip
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            Loading trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            No trips yet. Create your first trip on the <Link href="/trips/new" className="underline underline-offset-2">new trip page</Link>.
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
              {trips.map((trip) => (
              <li
                key={trip.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-medium text-zinc-900">{trip.title}</h2>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-medium capitalize text-zinc-700">
                    {trip.status}
                  </span>
                </div>

                {trip.description ? (
                  <p className="mt-2 text-sm text-zinc-700">{trip.description}</p>
                ) : null}

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
    </div>
  );
}
