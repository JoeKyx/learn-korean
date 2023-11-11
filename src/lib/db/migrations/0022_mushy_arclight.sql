CREATE TABLE `last_lessons` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`lesson_id` int NOT NULL,
	`language_id` int NOT NULL,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `last_lessons_id` PRIMARY KEY(`id`)
);
