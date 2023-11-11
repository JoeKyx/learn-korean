CREATE TABLE `card_designs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(256) NOT NULL,
	`image_url` varchar(256) NOT NULL,
	CONSTRAINT `card_designs_id` PRIMARY KEY(`id`)
);
