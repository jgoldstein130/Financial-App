CREATE TABLE "userInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plaid_token" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;