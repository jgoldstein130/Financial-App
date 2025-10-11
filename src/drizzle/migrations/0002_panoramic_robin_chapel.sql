ALTER TABLE "session" ADD CONSTRAINT "session_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_unique" UNIQUE("user_id");