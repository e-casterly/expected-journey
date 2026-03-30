import {
  bigint,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const place = pgTable(
  "place",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address"),
    notes: text("notes"),
    lat: doublePrecision("lat").notNull(),
    lon: doublePrecision("lon").notNull(),
    osmType: text("osm_type"),
    osmId: bigint("osm_id", { mode: "number" }),
    systemTags: text("system_tags").array().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("place_user_id_idx").on(table.userId),
    unique("place_user_osm_unique").on(
      table.userId,
      table.osmType,
      table.osmId
    ),
  ]
);