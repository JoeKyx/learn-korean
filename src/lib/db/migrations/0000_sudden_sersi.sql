CREATE TABLE `computers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`brand` varchar(256) NOT NULL,
	`cores` int NOT NULL,
	CONSTRAINT `computers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`level` int NOT NULL,
	`link` varchar(256),
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_words` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`word_id` int NOT NULL,
	`attempted_at` date NOT NULL,
	`success` boolean NOT NULL,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `user_words_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`word_eng` varchar(256) NOT NULL,
	`word_kor` varchar(256) NOT NULL,
	`hint` varchar(256),
	`level` int NOT NULL,
	`lesson_id` int NOT NULL,
	CONSTRAINT `words_id` PRIMARY KEY(`id`),
);
