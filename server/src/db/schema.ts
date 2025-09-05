import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: int("id").primaryKey({ autoIncrement: true }),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  members: many(members),
}));

export const members = sqliteTable("members", {
  id: int("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  mbti: text("mbti").notNull(),
  zodiac: text("zodiac").notNull(),

  author: int({ mode: "boolean" }).default(false).notNull(),
  secret: text("secret")
    .notNull()
    .$defaultFn(() => Math.random().toString(36).slice(2)),

  roomId: int("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const membersRelations = relations(members, ({ one }) => ({
  room: one(rooms, {
    fields: [members.roomId],
    references: [rooms.id],
  }),
}));
