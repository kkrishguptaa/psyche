PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`mbti` text NOT NULL,
	`zodiac` text NOT NULL,
	`author` integer DEFAULT false NOT NULL,
	`secret` text NOT NULL,
	`room_id` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_members`("id", "name", "mbti", "zodiac", "author", "secret", "room_id") SELECT "id", "name", "mbti", "zodiac", "author", "secret", "room_id" FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;--> statement-breakpoint
PRAGMA foreign_keys=ON;