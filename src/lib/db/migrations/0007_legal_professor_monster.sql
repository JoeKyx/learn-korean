ALTER TABLE `user_settings` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `lessons` ADD `user_id` varchar(256);--> statement-breakpoint
ALTER TABLE `user_settings` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `user_settings` ADD PRIMARY KEY(`user_id`);