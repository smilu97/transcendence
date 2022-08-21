create extension if not exists "uuid-ossp";

create table if not exists "user" (
    "id" uuid primary key default uuid_generate_v4 (),
    "detailId" uuid not null,
    "username" varchar(32) not null,
    "password" varchar(128) not null
);

create table if not exists "user_detail" (
    "id" uuid primary key default uuid_generate_v4 (),
    "description" varchar(500) not null default ''
);

-- OAuth mapping
create table if not exists "ext_auth" (
    "userId" uuid not null references "user" ("id")
        on delete cascade,
    "extId" varchar(128) not null,
    primary key ("userId", "extId")
);

create index "idx_ext_id" on "ext_auth" using hash ("extId");

create table if not exists "userHealth" (
    "userId" uuid not null primary key,
    "content" varchar(16) not null,
    "timestamp" bigint not null
);

create table if not exists "chat_channel" (
    "id" uuid primary key default uuid_generate_v4 (),
    "type" varchar(8) not null,
    "name" varchar(32) not null,
    "owner" uuid not null,
    "password" varchar(32) not null
);

create table if not exists "chat_message" (
    "id" uuid primary key default uuid_generate_v4 (),
    "channelId" uuid not null references "chat_channel" ("id")
        on delete cascade,
    "authorId" uuid,
    "content" varchar(128) not null,
    "createdAt" bigint not null
);

create index "idx_created_at" on "chat_message" using btree ("createdAt" asc);

create table if not exists "chat_member" (
    "channelId" uuid not null references "chat_channel" ("id")
        on delete cascade,
    "userId" uuid not null references "user" ("id")
        on delete cascade,
    "role" varchar(16) not null,
    primary key ("channelId", "userId")
);

create table if not exists "chat_ban" (
    "channelId" uuid not null references "chat_channel" ("id")
        on delete cascade,
    "userId" uuid not null references "user" ("id")
        on delete cascade,
    "expiredAt" bigint not null,
    primary key ("channelId", "userId")
);

create table if not exists "chat_global_mute" (
    "channelId" uuid not null references "chat_channel" ("id")
        on delete cascade,
    "userId" uuid not null references "user" ("id")
        on delete cascade,
    "expiredAt" bigint not null,
    primary key ("channelId", "userId")
);