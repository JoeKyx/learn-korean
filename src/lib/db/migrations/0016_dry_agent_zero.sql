CREATE TABLE `lesson_categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(256) NOT NULL,
	CONSTRAINT `lesson_categories_id` PRIMARY KEY(`id`)
);
