-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_admin" boolean NOT NULL DEFAULT false,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"content" text NOT NULL,
	"excerpt" text,
	"author_id" integer NOT NULL REFERENCES "users"("id"),
	"published" boolean NOT NULL DEFAULT false,
	"view_count" integer NOT NULL DEFAULT 0,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL UNIQUE,
	"slug" varchar(100) NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS "post_tags" (
	"post_id" integer NOT NULL REFERENCES "posts"("id"),
	"tag_id" integer NOT NULL REFERENCES "tags"("id")
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS "posts_author_id_idx" ON "posts"("author_id");
CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts"("slug");
CREATE INDEX IF NOT EXISTS "posts_published_idx" ON "posts"("published");
CREATE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags"("slug");
CREATE INDEX IF NOT EXISTS "post_tags_post_id_idx" ON "post_tags"("post_id");
CREATE INDEX IF NOT EXISTS "post_tags_tag_id_idx" ON "post_tags"("tag_id");
