CREATE TABLE `user_settings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`language_id` int,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`)
);
