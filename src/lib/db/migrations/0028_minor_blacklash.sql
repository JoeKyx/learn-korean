CREATE TABLE `user_cards` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`cardDesign_id` int NOT NULL,
	`unlocked_at` timestamp NOT NULL,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `user_cards_id` PRIMARY KEY(`id`)
);
