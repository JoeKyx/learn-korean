CREATE TABLE `dates_studied` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`attempts` int NOT NULL,
	`successful` int NOT NULL,
	`failed` int NOT NULL,
	`language_id` int NOT NULL,
	`lesson_id` int NOT NULL,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `dates_studied_id` PRIMARY KEY(`id`)
);
