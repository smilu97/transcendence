create extension if not exists "uuid-ossp";

create table "user" (
    "id" bigint primary key,
    "detailId" bigint not null,
    "username" varchar(32) not null,
    "password" varchar(128) not null
);

create table "user_detail" (
    "id" bigint primary key,
    "description" varchar(500) not null default ''
);

-- OAuth mapping
create table "ext_auth" (
    "userId" bigint not null references "user" ("id")
        on delete cascade,
    "extId" varchar(128) not null,
    primary key ("userId", "extId")
);

create index "idx_ext_id" on "ext_auth" using hash ("extId");

create table "userHealth" (
    "userId" bigint not null primary key,
    "content" varchar(16) not null,
    "timestamp" bigint not null
);

create table "chat_channel" (
    "id" bigint primary key,
    "type" varchar(8) not null,
    "name" varchar(32) not null,
    "owner" bigint not null,
    "password" varchar(32) not null
);

create table "chat_message" (
    "id" bigint primary key,
    "channelId" bigint not null references "chat_channel" ("id")
        on delete cascade,
    "authorId" bigint,
    "content" varchar(128) not null,
    "createdAt" bigint not null
);

create index "idx_created_at" on "chat_message" using btree ("createdAt" asc);

create table "chat_member" (
    "channelId" bigint not null references "chat_channel" ("id")
        on delete cascade,
    "userId" bigint not null references "user" ("id")
        on delete cascade,
    "role" varchar(16) not null,
    primary key ("channelId", "userId")
);

create table "chat_ban" (
    "channelId" bigint not null references "chat_channel" ("id")
        on delete cascade,
    "userId" bigint not null references "user" ("id")
        on delete cascade,
    "expiredAt" bigint not null,
    primary key ("channelId", "userId")
);

create table "chat_global_mute" (
    "channelId" bigint not null references "chat_channel" ("id")
        on delete cascade,
    "userId" bigint not null references "user" ("id")
        on delete cascade,
    "expiredAt" bigint not null,
    primary key ("channelId", "userId")
);