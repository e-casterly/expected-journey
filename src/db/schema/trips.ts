import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { place } from "./places";

export const trip = pgTable(
  "trip",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug"),
    description: text("description"),
    startPlaceId: text("start_place_id").references(() => place.id, {
      onDelete: "set null",
    }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("trip_user_id_idx").on(table.userId),
    index("trip_status_idx").on(table.status),
    index("trip_start_place_id_idx").on(table.startPlaceId),
  ],
);

export const tripRelations = relations(trip, ({ one }) => ({
  user: one(user, {
    fields: [trip.userId],
    references: [user.id],
  }),
  startPlace: one(place, {
    fields: [trip.startPlaceId],
    references: [place.id],
  }),
}));
