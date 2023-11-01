CREATE TABLE `tests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`test` varchar(256) NOT NULL,
	CONSTRAINT `tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tests2` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	CONSTRAINT `tests2_id` PRIMARY KEY(`id`)
);
