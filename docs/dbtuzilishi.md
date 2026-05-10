Ha, endi **Maze Champions MVP database modelini** shakllantiramiz.
Maqsad: **minimal**, lekin keyinchalik hudud egallash, ittifoq, skin,
ranking, boss, mobs qo'shilganda buzilib ketmaydigan DB qilish.

Asosiy qoida:

Database real-time yurish/urishlarni saqlamaydi.\
Database faqat doimiy ma'lumotlarni va match natijasini saqlaydi.

Ya'ni player harakat qilgani, har soniyadagi pozitsiyasi, kamera
burilishi DBga yozilmaydi. Bular match vaqtida server memory ichida
bo'ladi.

# 1. MVP uchun kerak bo'ladigan asosiy jadvallar

MVP uchun mana shu 8 ta jadval yetadi:

users\
player_stats\
roles\
maps\
map_spawn_points\
tasks\
matches\
teams\
match_players

Ya'ni asosiy model shunday:

User → Player Stats\
\
Match → Map\
Match → Task\
Match → Teams\
Team → Match Players\
Match Player → User\
Match Player → Role

# 2. Jadval vazifalari

## 1. users

Bu jadval o'yinchining akkauntini saqlaydi.

MVP da user login qilib kirishi yoki guest sifatida kirishi mumkin.
Shuning uchun email va password_hash nullable bo'lishi mumkin.

users\
- id\
- username\
- email\
- password_hash\
- is_guest\
- avatar_url\
- created_at\
- updated_at

Muhim:

is_guest = true bo'lsa, bu vaqtinchalik user.\
is_guest = false bo'lsa, oddiy ro'yxatdan o'tgan user.

## 2. player_stats

Bu jadval userning umumiy statistikasini saqlaydi.

player_stats\
- id\
- user_id\
- level\
- xp\
- total_matches\
- wins\
- losses\
- kills\
- deaths\
- assists\
- damage_dealt\
- healing_done\
- created_at\
- updated_at

Bu yerda umumiy statistikalar yig'iladi. Masalan, user 100 ta match
o'ynagan bo'lsa, hammasi shu yerda ko'rinadi.

## 3. roles

Bu jadval o'yindagi rollarni saqlaydi.

MVP da 4 ta role bo'ladi:

Warrior\
Archer\
Healer\
Mage / Sehrgar

Jadval:

roles\
- id\
- key\
- name\
- description\
- base_hp\
- base_damage\
- base_speed\
- attack_range\
- skill_config\
- is_active\
- created_at\
- updated_at

skill_config ni jsonb qilamiz. Sababi har bir role skilli har xil
bo'ladi.

Masalan Warrior uchun:

{\
\"main_attack\": \"sword_attack\",\
\"skill\": \"dash\",\
\"cooldown\": 5\
}

Mage uchun:

{\
\"main_attack\": \"fireball\",\
\"skill\": \"area_blast\",\
\"cooldown\": 8\
}

Bu keyinchalik yangi role qo'shishni osonlashtiradi.

## 4. maps

Bu jadval labirint xaritalarini saqlaydi.

MVP da bitta xarita bo'ladi, lekin keyinchalik bir nechta xarita
qo'shiladi.

maps\
- id\
- name\
- description\
- seed\
- width\
- height\
- max_players\
- is_active\
- created_at\
- updated_at

Masalan:

name: Classic Maze\
seed: maze_001\
width: 100\
height: 100\
max_players: 12

## 5. map_spawn_points

Bu jadval har bir xaritadagi tug'ilish nuqtalarini saqlaydi.

Siz aytgandek, MVP da 12 ta spawn point bo'ladi.

map_spawn_points\
- id\
- map_id\
- name\
- position_x\
- position_y\
- position_z\
- order_index\
- created_at

Nega alohida jadval qilamiz?

Chunki keyinchalik har bir mapda spawn pointlar har xil bo'lishi mumkin.
Agar buni maps ichida JSON qilib tashlasak ham bo'ladi, lekin alohida
jadval qilish professionalroq va kengaytirishga qulayroq.

## 6. tasks

Bu jadval match boshida beriladigan vazifalarni saqlaydi.

MVP da bitta task bo'ladi:

Survival --- oxirigacha tirik qol.

Jadval:

tasks\
- id\
- key\
- title\
- description\
- win_condition\
- is_active\
- created_at\
- updated_at

win_condition jsonb bo'ladi.

MVP uchun:

{\
\"type\": \"last_team_alive\"\
}

Keyinchalik territory uchun:

{\
\"type\": \"territory_control\",\
\"winner\": \"largest_territory\"\
}

## 7. matches

Bu jadval har bir o'yin partiyasini saqlaydi.

matches\
- id\
- map_id\
- task_id\
- status\
- max_players\
- seed\
- started_at\
- ended_at\
- winner_team_id\
- settings\
- created_at\
- updated_at

status quyidagicha bo'lishi mumkin:

WAITING\
COUNTDOWN\
ACTIVE\
FINISHED\
CANCELLED

settings ham jsonb bo'ladi. Masalan:

{\
\"team_size_min\": 1,\
\"team_size_max\": 4,\
\"countdown_seconds\": 60,\
\"friendly_fire\": false\
}

## 8. teams

Bu jadval match ichidagi jamoalarni saqlaydi.

teams\
- id\
- match_id\
- name\
- color\
- spawn_point_id\
- placement\
- is_winner\
- created_at\
- updated_at

Masalan:

Team Red\
Team Blue\
Team Green

placement --- jamoa nechanchi o'rinni olgani.

Masalan:

1 = winner\
2 = second place\
3 = third place

## 9. match_players

Bu eng muhim jadval. Bu jadval qaysi user qaysi matchda, qaysi teamda,
qaysi role bilan o'ynaganini saqlaydi.

match_players\
- id\
- match_id\
- team_id\
- user_id\
- role_id\
- status\
- kills\
- deaths\
- assists\
- damage_dealt\
- healing_done\
- survived_seconds\
- team_xp_earned\
- performance_xp_earned\
- total_xp_earned\
- level_before\
- level_after\
- xp_breakdown\
- joined_at\
- left_at\
- created_at\
- updated_at

status:

ALIVE\
DEAD\
LEFT\
DISCONNECTED

xp_breakdown jsonb bo'ladi.

Masalan:

{\
\"team_reward\": 25,\
\"kills\": 20,\
\"assists\": 5,\
\"damage\": 3,\
\"heal\": 2,\
\"survival\": 6,\
\"total\": 61\
}

Bu juda foydali. Keyin result screen chiqarishda ham, tekshirishda ham
kerak bo'ladi.

# 3. MVP DB modeli --- qisqa ko'rinish

users\
↓\
player_stats\
\
users\
↓\
match_players\
↑\
roles\
\
matches\
↓\
teams\
↓\
match_players\
\
matches\
↑\
maps\
\
matches\
↑\
tasks\
\
maps\
↓\
map_spawn_points

# 4. dbdiagram.io uchun DBML varianti

Buni dbdiagram.io ga tashlasangiz, diagramma chiqadi.

Table users {\
id uuid \[pk\]\
username varchar(50) \[not null, unique\]\
email varchar(255) \[unique\]\
password_hash text\
is_guest boolean \[not null, default: false\]\
avatar_url text\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table player_stats {\
id uuid \[pk\]\
user_id uuid \[not null, unique\]\
level int \[not null, default: 1\]\
xp int \[not null, default: 0\]\
total_matches int \[not null, default: 0\]\
wins int \[not null, default: 0\]\
losses int \[not null, default: 0\]\
kills int \[not null, default: 0\]\
deaths int \[not null, default: 0\]\
assists int \[not null, default: 0\]\
damage_dealt int \[not null, default: 0\]\
healing_done int \[not null, default: 0\]\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table roles {\
id uuid \[pk\]\
key varchar(50) \[not null, unique\]\
name varchar(100) \[not null\]\
description text\
base_hp int \[not null\]\
base_damage int \[not null\]\
base_speed float \[not null\]\
attack_range float \[not null\]\
skill_config jsonb\
is_active boolean \[not null, default: true\]\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table maps {\
id uuid \[pk\]\
name varchar(100) \[not null\]\
description text\
seed varchar(100) \[not null\]\
width int \[not null\]\
height int \[not null\]\
max_players int \[not null, default: 12\]\
is_active boolean \[not null, default: true\]\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table map_spawn_points {\
id uuid \[pk\]\
map_id uuid \[not null\]\
name varchar(100)\
position_x float \[not null\]\
position_y float \[not null\]\
position_z float \[not null\]\
order_index int \[not null\]\
created_at timestamp \[not null\]\
}\
\
Table tasks {\
id uuid \[pk\]\
key varchar(50) \[not null, unique\]\
title varchar(150) \[not null\]\
description text\
win_condition jsonb\
is_active boolean \[not null, default: true\]\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table matches {\
id uuid \[pk\]\
map_id uuid \[not null\]\
task_id uuid \[not null\]\
status varchar(30) \[not null\]\
max_players int \[not null, default: 12\]\
seed varchar(100) \[not null\]\
started_at timestamp\
ended_at timestamp\
winner_team_id uuid\
settings jsonb\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table teams {\
id uuid \[pk\]\
match_id uuid \[not null\]\
name varchar(100) \[not null\]\
color varchar(30)\
spawn_point_id uuid\
placement int\
is_winner boolean \[not null, default: false\]\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Table match_players {\
id uuid \[pk\]\
match_id uuid \[not null\]\
team_id uuid \[not null\]\
user_id uuid \[not null\]\
role_id uuid \[not null\]\
status varchar(30) \[not null, default: \'ALIVE\'\]\
kills int \[not null, default: 0\]\
deaths int \[not null, default: 0\]\
assists int \[not null, default: 0\]\
damage_dealt int \[not null, default: 0\]\
healing_done int \[not null, default: 0\]\
survived_seconds int \[not null, default: 0\]\
team_xp_earned int \[not null, default: 0\]\
performance_xp_earned int \[not null, default: 0\]\
total_xp_earned int \[not null, default: 0\]\
level_before int \[not null, default: 1\]\
level_after int \[not null, default: 1\]\
xp_breakdown jsonb\
joined_at timestamp\
left_at timestamp\
created_at timestamp \[not null\]\
updated_at timestamp \[not null\]\
}\
\
Ref: player_stats.user_id \> users.id\
\
Ref: map_spawn_points.map_id \> maps.id\
\
Ref: matches.map_id \> maps.id\
Ref: matches.task_id \> tasks.id\
Ref: matches.winner_team_id \> teams.id\
\
Ref: teams.match_id \> matches.id\
Ref: teams.spawn_point_id \> map_spawn_points.id\
\
Ref: match_players.match_id \> matches.id\
Ref: match_players.team_id \> teams.id\
Ref: match_players.user_id \> users.id\
Ref: match_players.role_id \> roles.id

# 5. Boshlang'ich role seed data

DB yaratilgandan keyin roles jadvaliga boshlang'ich 4 ta role yoziladi.

Warrior\
HP: 120\
Damage: 25\
Range: yaqin\
Skill: sword_attack + dash\
\
Archer\
HP: 90\
Damage: 20\
Range: uzoq\
Skill: arrow_attack + long_shot\
\
Healer\
HP: 100\
Damage: 10\
Heal: 20\
Skill: weak_attack + heal\
\
Mage\
HP: 80\
Damage: 30\
Range: o'rta/uzoq\
Skill: fireball + area_blast

Bu yerda men Sehrgar uchun DB key sifatida mage ishlatishni tavsiya
qilaman. UI da esa Uzbekcha "Sehrgar" deb ko'rsataverasiz.

# 6. Boshlang'ich task seed data

MVP da bitta task:

key: survival\
title: Survival\
description: Oxirigacha tirik qolgan jamoa g'olib bo'ladi.\
win_condition:\
{\
\"type\": \"last_team_alive\"\
}

# 7. Boshlang'ich map seed data

MVP da bitta map:

name: Classic Maze\
seed: maze_classic_001\
width: 100\
height: 100\
max_players: 12

Unga 12 ta spawn point bog'lanadi.

# 8. Hozircha DBga qo'shmaymiz

MVP ni toza saqlash uchun hozir bularni qo'shmaymiz:

territories\
alliances\
mobs\
bosses\
skins\
inventory\
items\
weapons\
chat_messages\
friends\
rankings\
seasons\
battle_pass\
reports

Lekin hozirgi DB modeli keyinchalik ularni qo'shishga xalaqit bermaydi.

# 9. Yakuniy tavsiya

MVP uchun eng yaxshi DB modeli mana shu:

users\
player_stats\
roles\
maps\
map_spawn_points\
tasks\
matches\
teams\
match_players

Bu model quyidagilarni qoplaydi:

\- user login / guest\
- umumiy statistika\
- role tanlash\
- map tanlash\
- spawn point\
- task\
- match yaratish\
- team tuzish\
- matchga player qo'shish\
- kill/death/damage/heal\
- winner aniqlash\
- XP va level saqlash
