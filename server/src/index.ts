import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono<{
  Bindings: CloudflareBindings;
}>();

const { members, rooms } = schema;

app.get("/rooms/:id", async (c) => {
  const db = drizzle(c.env.db, {
    schema,
    logger: true,
  });
  const roomId = c.req.param("id");

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, Number(roomId)),
    with: {
      members: {
        columns: {
          id: true,
          name: true,
          mbti: true,
          zodiac: true,
        },
      },
    },
  });

  if (!room) {
    return c.json({ status: "error", error: "Room not found" }, 404);
  }

  return c.json({
    status: "success",
    data: room,
  });
});

app.post("/rooms", async (c) => {
  const body = await c.req.json().catch(() => {
    return {};
  });

  if (
    !body.author ||
    !body.author.name ||
    !body.author.mbti ||
    !body.author.zodiac
  ) {
    return c.json({ status: "error", error: "Missing required fields" }, 400);
  }

  const db = drizzle(c.env.db, {
    schema,
    logger: true,
  });

  const room = await db.insert(rooms).values({}).returning().get();

  const author = await db
    .insert(members)
    .values({
      name: body.author.name,

      roomId: room.id,
      author: true,

      mbti: body.author.mbti,
      zodiac: body.author.zodiac,
    })
    .returning()
    .get();

  return c.json({
    status: "success",
    data: {
      ...room,
      members: [author],
    },
  });
});

app.put("/rooms/:id", async (c) => {
  const body = await c.req.json().catch(() => {
    return {};
  });

  if (!body.name || !body.mbti || !body.zodiac) {
    return c.json({ status: "error", error: "Missing required fields" }, 400);
  }

  const db = drizzle(c.env.db, {
    schema,
    logger: true,
  });
  const roomId = c.req.param("id");

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, Number(roomId)),
    with: {
      members: {
        columns: {
          id: true,
          name: true,
          mbti: true,
          zodiac: true,
        },
      },
    },
  });

  if (!room) {
    return c.json({ status: "error", error: "Room not found" }, 404);
  }

  const member = await db
    .insert(members)
    .values({
      name: body.name,

      roomId: room.id,

      mbti: body.mbti,
      zodiac: body.zodiac,
    })
    .returning()
    .get();

  return c.json({
    status: "success",
    data: {
      ...room,
      members: [member, ...room?.members],
    },
  });
});

export default app;
