CREATE TABLE `word_user_categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`word_id` int NOT NULL,
	`wordCategorie_id` int NOT NULL,
	`added_at` timestamp NOT NULL,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `word_user_categories_id` PRIMARY KEY(`id`)
);
