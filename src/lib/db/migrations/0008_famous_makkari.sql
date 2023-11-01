CREATE TABLE `testing_models` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`anumbers` int NOT NULL,
	`a_boolean` boolean NOT NULL,
	`language_id` int NOT NULL,
	CONSTRAINT `testing_models_id` PRIMARY KEY(`id`)
);
