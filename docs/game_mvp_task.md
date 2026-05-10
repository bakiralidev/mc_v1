# Maze Champions MVP --- Development Task Plan

## MVP yakuniy maqsadi

MVP oxirida quyidagi holat ishlashi kerak:

User o'yinga kiradi\
→ Guest yoki login qiladi\
→ Lobby yaratadi yoki lobby code orqali qo'shiladi\
→ Team tanlaydi yoki solo qoladi\
→ Role tanlaydi\
→ Ready bosadi\
→ Kamida 2 player va 2 team bo'lsa countdown boshlanadi\
→ Match start bo'ladi\
→ Playerlar labirintda bir-birini ko'radi\
→ Harakat, attack, damage, heal, death ishlaydi\
→ Oxirgi tirik qolgan team winner bo'ladi\
→ XP, level, statistika hisoblanadi\
→ Natijalar databasega yoziladi\
→ Result screen chiqadi

# 1-task: Project structure va asosiy muhitni tayyorlash

## Maqsad

Frontend, backend va database bilan ishlash uchun loyihaning asosiy
strukturasi tayyor bo'lishi kerak.

## Nima qilish kerak

Loyiha quyidagicha tashkil qilinadi:

maze-champions/\
backend/\
frontend/\
docs/\
README.md

Backend uchun:

Node.js\
Express\
Socket.io\
PostgreSQL\
ORM yoki raw query

Frontend uchun:

Next.js\
React Three Fiber / Three.js\
TailwindCSS\
Socket.io-client

.env fayllar tayyorlanadi:

DATABASE_URL\
JWT_SECRET\
PORT\
CLIENT_URL\
NODE_ENV

Backendda oddiy health endpoint bo'ladi:

GET /health

## Tekshirish kerak

Task to'g'ri bajarilganini bilish uchun:

backend ishga tushadi\
frontend ishga tushadi\
GET /health \"ok\" qaytaradi\
.env orqali database ulanishi ishlaydi\
frontend backendga request yubora oladi

# 2-task: Database schema yaratish

## Maqsad

MVP uchun kerakli minimal database jadvallar yaratiladi.

## Nima qilish kerak

Quyidagi jadvallar yaratiladi:

users\
player_stats\
roles\
maps\
map_spawn_points\
tasks\
matches\
teams\
match_players

users:

id\
username\
email\
password_hash\
is_guest\
avatar_url\
created_at\
updated_at

player_stats:

id\
user_id\
level\
xp\
total_matches\
wins\
losses\
kills\
deaths\
assists\
damage_dealt\
healing_done\
created_at\
updated_at

roles:

id\
key\
name\
description\
base_hp\
base_damage\
base_speed\
attack_range\
skill_config\
is_active\
created_at\
updated_at

maps:

id\
name\
description\
seed\
width\
height\
max_players\
is_active\
created_at\
updated_at

map_spawn_points:

id\
map_id\
name\
position_x\
position_y\
position_z\
order_index\
created_at

tasks:

id\
key\
title\
description\
win_condition\
is_active\
created_at\
updated_at

matches:

id\
lobby_code\
created_by_user_id\
map_id\
task_id\
status\
min_players\
min_teams\
max_players\
seed\
started_at\
ended_at\
winner_team_id\
settings\
created_at\
updated_at

teams:

id\
match_id\
name\
color\
spawn_point_id\
placement\
is_winner\
created_at\
updated_at

match_players:

id\
match_id\
team_id\
user_id\
role_id\
status\
is_ready\
kills\
deaths\
assists\
damage_dealt\
healing_done\
survived_seconds\
team_xp_earned\
performance_xp_earned\
total_xp_earned\
level_before\
level_after\
xp_breakdown\
joined_at\
left_at\
created_at\
updated_at

## Tekshirish kerak

barcha jadvallar database'da mavjud\
foreign key relationlar to'g'ri ishlaydi\
users → player_stats bog'langan\
matches → teams bog'langan\
teams → match_players bog'langan\
match_players → users, roles, matches bog'langan\
lobby_code unique\
username unique

# 3-task: Seed data qo'shish

## Maqsad

O'yin boshlanishi uchun kerak bo'ladigan boshlang'ich role, map, spawn
point va tasklar databasega yoziladi.

## Nima qilish kerak

4 ta role qo'shiladi:

Warrior\
Archer\
Healer\
Mage

Role statlari:

Warrior:\
HP 120\
Damage 25\
Range yaqin\
Skill sword_attack + dash\
\
Archer:\
HP 90\
Damage 20\
Range uzoq\
Skill arrow_attack + long_shot\
\
Healer:\
HP 100\
Damage 10\
Heal 20\
Skill weak_attack + heal\
\
Mage:\
HP 80\
Damage 30\
Range o'rta/uzoq\
Skill fireball + area_blast

1 ta map qo'shiladi:

Classic Maze\
seed: maze_classic_001\
max_players: 12

12 ta spawn point qo'shiladi.

1 ta task qo'shiladi:

key: survival\
title: Survival\
win_condition: last_team_alive

## Tekshirish kerak

roles jadvalida 4 ta role bor\
maps jadvalida 1 ta active map bor\
map_spawn_points jadvalida 12 ta spawn point bor\
tasks jadvalida survival task bor\
backend role list so'raganda 4 ta role qaytadi

# 4-task: Guest user yaratish

## Maqsad

User ro'yxatdan o'tmasdan ham tez o'yinga kira olishi kerak.

## Nima qilish kerak

Endpoint yaratiladi:

POST /auth/guest

Bu endpoint vaqtinchalik guest user yaratadi.

Masalan:

Guest_4821

Guest user yaratilganda unga player_stats ham yaratiladi.

Response:

{\
\"user\": {\
\"id\": \"\...\",\
\"username\": \"Guest_4821\",\
\"is_guest\": true\
},\
\"token\": \"\...\"\
}

## Tekshirish kerak

guest user yaratiladi\
users jadvaliga yoziladi\
player_stats avtomatik yaratiladi\
token qaytadi\
shu token bilan himoyalangan endpointlarga kirish mumkin

# 5-task: Register/Login tizimi

## Maqsad

Doimiy userlar username/email/password orqali kirishi kerak.

## Nima qilish kerak

Endpointlar:

POST /auth/register\
POST /auth/login\
GET /auth/me

Register paytida:

username unique bo'lishi kerak\
email unique bo'lishi kerak\
password hash qilinadi\
player_stats yaratiladi

Login paytida:

email yoki username tekshiriladi\
password tekshiriladi\
JWT token qaytariladi

## Tekshirish kerak

user register qila oladi\
bir xil username bilan qayta register bo'lmaydi\
login ishlaydi\
noto'g'ri password error beradi\
GET /auth/me token orqali userni qaytaradi

# 6-task: Main menu va profile stats API

## Maqsad

Frontend main menu va profile ekraniga kerakli ma'lumotlarni ola olishi
kerak.

## Nima qilish kerak

Endpointlar:

GET /profile/me\
GET /profile/stats

Qaytadigan ma'lumotlar:

username\
level\
xp\
total_matches\
wins\
losses\
kills\
deaths\
assists\
damage_dealt\
healing_done

## Tekshirish kerak

guest user stats ko'ra oladi\
registered user stats ko'ra oladi\
match o'ynamagan userda default stats 0 bo'ladi

# 7-task: Lobby yaratish

## Maqsad

User yangi lobby yaratishi va lobby code olishi kerak.

## Nima qilish kerak

Endpoint:

POST /matches/create-lobby

Tizim:

yangi match yaratadi\
status WAITING qiladi\
lobby_code generatsiya qiladi\
created_by_user_id yozadi\
map va taskni default active qiymatdan tanlaydi\
min_players = 2\
min_teams = 2\
max_players = 12\
settings yozadi

Response:

{\
\"match_id\": \"\...\",\
\"lobby_code\": \"AB12CD\",\
\"status\": \"WAITING\"\
}

## Tekshirish kerak

lobby yaratiladi\
lobby_code unique bo'ladi\
matches jadvaliga yoziladi\
status WAITING bo'ladi\
frontendda lobby code ko'rinadi

# 8-task: Lobby code orqali qo'shilish

## Maqsad

Boshqa user lobby code kiritib shu matchga kira olishi kerak.

## Nima qilish kerak

Endpoint:

POST /matches/join-by-code

Body:

{\
\"lobby_code\": \"AB12CD\"\
}

Tizim tekshiradi:

lobby mavjudmi\
status WAITING yoki COUNTDOWNmi\
match ACTIVE emasmi\
match to'lmaganmi\
user oldin shu matchda yo'qmi

Agar hammasi to'g'ri bo'lsa, match_players yozuvi yaratiladi.

Boshlang'ich qiymatlar:

team_id = null\
role_id = null\
status = WAITING\
is_ready = false

## Tekshirish kerak

to'g'ri code bilan user lobbyga kiradi\
noto'g'ri code error beradi\
boshlangan matchga kira olmaydi\
to'lgan lobbyga kira olmaydi\
bir user bitta lobbyga ikki marta qo'shilmaydi

# 9-task: Socket connection va lobby room

## Maqsad

Lobby ichidagi o'zgarishlar real-time ko'rinishi kerak.

## Nima qilish kerak

Socket eventlar:

connect\
join_lobby_room\
leave_lobby_room\
lobby_updated

User lobbyga kirganda socket orqali shu match roomga qo'shiladi:

room: match:{match_id}

Lobbyda o'zgarish bo'lsa barcha playerlarga yuboriladi:

lobby_updated

## Tekshirish kerak

2 ta browser bilan kirganda ikkalasi bitta lobbyda ko'rinadi\
Player 2 qo'shilsa Player 1 ekranida real-time ko'rinadi\
Player chiqsa boshqa player ekranida yangilanadi\
socket disconnect bo'lsa backend crash bo'lmaydi

# 10-task: Team yaratish va teamga qo'shilish

## Maqsad

Lobby ichida user team yaratishi, mavjud teamga qo'shilishi yoki solo
qolishi kerak.

## Nima qilish kerak

Socket yoki API eventlar:

create_team\
join_team\
leave_team

Team qoidalari:

team min size 1\
team max size 4\
user faqat bitta teamda bo'ladi\
solo ham alohida team sifatida yaratiladi\
match ACTIVE bo'lgandan keyin team o'zgarmaydi

Team yaratganda:

teams jadvaliga yoziladi\
match_players.team_id yangilanadi

## Tekshirish kerak

user yangi team yarata oladi\
user mavjud teamga qo'shila oladi\
teamda 4 tadan ko'p player bo'lmaydi\
user boshqa teamga o'tsa oldingi teamdan chiqadi\
bo'sh qolgan team o'chiriladi yoki inactive qilinadi\
match ACTIVE bo'lsa team o'zgartirib bo'lmaydi

# 11-task: Role tanlash

## Maqsad

User lobby ichida o'z rolini tanlay olishi kerak.

## Nima qilish kerak

Event:

select_role

Body:

{\
\"match_id\": \"\...\",\
\"role_id\": \"\...\"\
}

Tizim tekshiradi:

role mavjudmi\
role active holatdami\
user shu match ichidami\
match ACTIVE emasmi

Keyin:

match_players.role_id yangilanadi\
is_ready false holatga qaytarilishi mumkin

## Tekshirish kerak

user Warrior tanlay oladi\
user Archer tanlay oladi\
user Healer tanlay oladi\
user Mage tanlay oladi\
noto'g'ri role_id error beradi\
role tanlanganda lobby real-time yangilanadi

# 12-task: Ready tizimi

## Maqsad

Player team va role tanlagandan keyin Ready bosishi kerak.

## Nima qilish kerak

Event:

set_ready

Tizim tekshiradi:

user match ichidami\
team tanlanganmi\
role tanlanganmi\
match WAITING yoki COUNTDOWN holatidami

Agar to'g'ri bo'lsa:

match_players.is_ready = true

Ready bekor qilish ham bo'lishi mumkin:

is_ready = false

## Tekshirish kerak

team tanlamagan user Ready bosolmaydi\
role tanlamagan user Ready bosolmaydi\
team va role tanlagan user Ready bo'la oladi\
Ready holati boshqa playerlarda real-time ko'rinadi

# 13-task: Match start shartlarini tekshirish

## Maqsad

Match faqat to'g'ri shartlar bajarilganda boshlanishi kerak.

## Nima qilish kerak

Backendda reusable function yoziladi:

canStartMatch(match_id)

Bu function tekshiradi:

kamida 2 player bor\
kamida 2 team bor\
barcha player teamga ega\
barcha player role tanlagan\
barcha player Ready\
match status WAITING yoki COUNTDOWN

## Tekshirish kerak

1 player bilan match boshlanmaydi\
2 player 1 teamda bo'lsa boshlanmaydi\
2 player 2 teamda bo'lsa boshlanadi\
role tanlanmasa boshlanmaydi\
Ready bo'lmasa boshlanmaydi

# 14-task: Countdown tizimi

## Maqsad

Start shartlari bajarilganda 60 soniyalik countdown boshlanishi kerak.

## Nima qilish kerak

Agar canStartMatch = true bo'lsa:

match status COUNTDOWN\
countdown 60 sekund

Socket event:

countdown_started\
countdown_tick\
countdown_cancelled

Countdown paytida shartlar buzilsa:

countdown to'xtaydi\
match status WAITING bo'ladi

## Tekshirish kerak

2 player 2 team Ready bo'lsa countdown boshlanadi\
countdown barcha playerlarda ko'rinadi\
player chiqib ketsa countdown cancel bo'ladi\
player Ready bekor qilsa countdown cancel bo'ladi\
countdown 0 bo'lsa match start bo'ladi

# 15-task: Server-side game state yaratish

## Maqsad

Match davomida real-time holat database'da emas, server memory'da
saqlanishi kerak.

## Nima qilish kerak

Backendda GameStateManager yoki shunga o'xshash modul yaratiladi.

Har active match uchun memory state:

match_id\
status\
players\
teams\
map\
spawn_points\
started_at

Har player uchun:

user_id\
match_player_id\
team_id\
role_id\
current_hp\
max_hp\
position\
rotation\
status\
last_attack_time\
kills\
deaths\
assists\
damage_dealt\
healing_done\
survived_seconds

## Tekshirish kerak

match ACTIVE bo'lganda memory state yaratiladi\
har player uchun current_hp role HP bilan beriladi\
match tugaganda memory state tozalanadi\
databasega harakatlar yozilmaydi

# 16-task: Map va spawn tizimi

## Maqsad

Match boshlanganda teamlar to'g'ri spawn pointlarga joylashtirilishi
kerak.

## Nima qilish kerak

Tizim:

active mapni oladi\
12 ta spawn pointni oladi\
teamlar soniga qarab spawn tanlaydi\
teamlarni imkon qadar uzoq joylashtiradi\
bitta teamdagi playerlar bir spawn yaqinida paydo bo'ladi

MVP uchun oddiy algoritm yetadi:

agar 2 team bo'lsa: Spawn 1 va Spawn 7\
agar 3 team bo'lsa: Spawn 1, 5, 9\
agar 4 team bo'lsa: Spawn 1, 4, 7, 10

## Tekshirish kerak

2 team bir joyda spawn bo'lmaydi\
har teamda spawn_point_id yoziladi\
playerlar o'z team spawn yaqinida paydo bo'ladi\
spawn nuqtalari frontendda to'g'ri ko'rinadi

# 17-task: Match start qilish

## Maqsad

Countdown tugagandan keyin match active bo'lishi kerak.

## Nima qilish kerak

Countdown 0 bo'lganda:

canStartMatch oxirgi marta tekshiriladi\
matches.status ACTIVE bo'ladi\
started_at yoziladi\
GameState yaratiladi\
teamlar spawn qilinadi\
playerlarga boshlang'ich HP beriladi\
match_started event yuboriladi

Socket event:

match_started

Response ichida:

map data\
player spawn position\
team data\
role stats\
task

## Tekshirish kerak

countdown tugasa match ACTIVE bo'ladi\
lobbyga yangi user kira olmaydi\
team o'zgarmaydi\
role o'zgarmaydi\
playerlar xaritada paydo bo'ladi\
task ko'rinadi

# 18-task: Frontend 3D scene va oddiy labirint ko'rinishi

## Maqsad

Player match boshlanganda labirint sahnasini ko'rishi kerak.

## Nima qilish kerak

Frontendda 3D scene yaratiladi:

ground\
labyrinth walls\
spawn points\
player model\
other players\
basic camera

MVPda grafikani murakkab qilish shart emas. Blocky personaj va oddiy
devorlar yetadi.

## Tekshirish kerak

match boshlanganda 3D scene ochiladi\
player o'zini ko'radi\
boshqa playerlar ko'rinadi\
devorlar ko'rinadi\
player spawn nuqtadan boshlaydi

# 19-task: Movement sync

## Maqsad

Player harakatlanganda boshqa playerlar uni real-time ko'rishi kerak.

## Nima qilish kerak

Frontenddan socket event:

player_move

Data:

position_x\
position_y\
position_z\
rotation\
velocity

Server tekshiradi:

match ACTIVE\
player ALIVE\
tezlik juda oshib ketmagan\
position valid

Server boshqa playerlarga yuboradi:

player_moved

## Tekshirish kerak

Chrome va Incognito bilan 2 player kiradi\
Player 1 yursa Player 2 ekranida ko'rinadi\
Player 2 yursa Player 1 ekranida ko'rinadi\
dead player yura olmaydi\
match tugagandan keyin movement ishlamaydi

# 20-task: Collision va devordan o'tmaslik

## Maqsad

Player labirint devorlaridan o'tib ketmasligi kerak.

## Nima qilish kerak

MVP uchun collision 2 xil usuldan biri bilan qilinadi:

frontend collision\
server basic validation

Eng minimal MVP uchun:

frontend playerni devordan o'tkazmaydi\
server esa juda noto'g'ri positionlarni rad etadi

## Tekshirish kerak

player devor ichidan o'ta olmaydi\
player map tashqarisiga chiqmaydi\
server juda uzoq teleport movementni rad etadi

# 21-task: Basic attack tizimi

## Maqsad

Player attack qilganda server damage hisoblay olishi kerak.

## Nima qilish kerak

Socket event:

player_attack

Data:

attack_type\
direction\
target_id

Server tekshiradi:

match ACTIVE\
attacker ALIVE\
target ALIVE\
target boshqa teamdan\
cooldown tugagan\
target range ichida

Agar valid bo'lsa:

damage hisoblanadi\
target HP kamayadi\
damage_dealt oshadi\
attack_result event yuboriladi

## Tekshirish kerak

Warrior yaqin masofada ura oladi\
Archer uzoqroqdan ura oladi\
bir teamdagi playerga damage bermaydi\
cooldown bo'lmasa spam attack ishlamaydi\
target HP kamayadi

# 22-task: Role skilllarini MVP darajada ishlatish

## Maqsad

Har bir role o'ziga xos skillga ega bo'lishi kerak.

## Nima qilish kerak

MVP uchun skilllar juda oddiy bo'ladi.

Warrior:

sword_attack\
dash

Archer:

arrow_attack\
long_shot

Healer:

weak_attack\
heal

Mage:

fireball\
area_blast

Minimal implementatsiya:

dash → player qisqa masofaga tez siljiydi\
long_shot → oddiy attackdan uzoqroq range\
heal → teamdagi player HP tiklaydi\
fireball → bitta targetga damage\
area_blast → kichik radiusdagi dushmanlarga damage

## Tekshirish kerak

Warrior dash qila oladi\
Archer uzoq range attack qila oladi\
Healer teamdoshi HP sini tiklaydi\
Mage fireball bilan damage beradi\
skill cooldown ishlaydi\
noto'g'ri role boshqa skill ishlata olmaydi

# 23-task: HP, damage va death tizimi

## Maqsad

Player HP kamayishi, o'lishi va dead holatga o'tishi kerak.

## Nima qilish kerak

Har player match startda role HP oladi:

Warrior 120\
Archer 90\
Healer 100\
Mage 80

Damage olganda:

current_hp = current_hp - damage

Agar HP 0 yoki past bo'lsa:

status DEAD\
deaths +1\
killer kills +1

Socket eventlar:

player_damaged\
player_dead

## Tekshirish kerak

damage HPni kamaytiradi\
HP 0 bo'lsa player DEAD bo'ladi\
DEAD player yura olmaydi\
DEAD player attack qila olmaydi\
killer kills +1 oladi\
victim deaths +1 oladi

# 24-task: Heal tizimi

## Maqsad

Healer o'z teamidagi tirik playerni davolay olishi kerak.

## Nima qilish kerak

Healer skill:

heal_amount = 20

Server tekshiradi:

healer ALIVE\
target ALIVE\
target bir teamdan\
target range ichida\
cooldown tugagan

HP max HPdan oshmasligi kerak.

final_hp = min(current_hp + heal_amount, max_hp)

## Tekshirish kerak

Healer teamdoshini davolaydi\
Healer dushmanni davolay olmaydi\
dead player heal olmaydi\
HP max HPdan oshmaydi\
healing_done statistikasi oshadi

# 25-task: Team elimination

## Maqsad

Teamdagi hamma player o'lsa, team eliminated bo'lishi kerak.

## Nima qilish kerak

Har deathdan keyin server teamni tekshiradi:

teamda ALIVE player bormi?

Agar yo'q bo'lsa:

team eliminated

Socket event:

team_eliminated

## Tekshirish kerak

1 kishilik team playeri o'lsa team eliminated bo'ladi\
2 kishilik teamda 1 player tirik bo'lsa eliminated bo'lmaydi\
teamdagi oxirgi player o'lsa eliminated bo'ladi

# 26-task: Winner aniqlash

## Maqsad

Survival rejimda oxirgi tirik qolgan team winner bo'lishi kerak.

## Nima qilish kerak

Har team eliminationdan keyin server tekshiradi:

alive teamlar soni nechta?

Agar:

alive_teams.length === 1

bo'lsa:

winner_team = alive team\
finishMatch()

## Tekshirish kerak

2 teamdan biri o'lsa ikkinchisi winner bo'ladi\
3 teamdan bittasi o'lsa match davom etadi\
faqat 1 team qolsa match tugaydi\
winner_team_id to'g'ri aniqlanadi

# 27-task: Match finish qilish

## Maqsad

Winner aniqlangandan keyin match to'g'ri yakunlanishi kerak.

## Nima qilish kerak

Finish paytida:

matches.status = FINISHED\
matches.ended_at = current time\
matches.winner_team_id = winner team\
teams.is_winner yangilanadi\
teams.placement hisoblanadi

Socket event:

match_ended

## Tekshirish kerak

winner aniqlanganda match FINISHED bo'ladi\
match tugagandan keyin movement ishlamaydi\
attack ishlamaydi\
heal ishlamaydi\
winner team barcha playerlarda ko'rinadi

# 28-task: XP hisoblash

## Maqsad

Match tugagandan keyin XP to'g'ri hisoblanishi kerak.

## Nima qilish kerak

XP ikki qismdan iborat:

team_xp\
performance_xp

Winner team:

100 XP team reward

Team reward playerlar soniga bo'linadi:

1 player → 100 XP\
2 player → 50 XP\
4 player → 25 XP

Performance XP:

Kill: +10 XP\
Assist: +5 XP\
Damage: +0.1 XP har 10 damage uchun\
Heal: +0.1 XP har 10 heal uchun\
Survival time: +1 XP har 60 soniya uchun\
Objective: +20 XP

Final:

total_xp = team_xp + performance_xp

## Tekshirish kerak

winner team team XP oladi\
loser team team XP olmaydi\
kill XP hisoblanadi\
assist XP hisoblanadi\
damage XP hisoblanadi\
heal XP hisoblanadi\
survival time XP hisoblanadi\
total_xp to'g'ri chiqadi

# 29-task: Level hisoblash

## Maqsad

Player olgan XP umumiy XPga qo'shilib, kerak bo'lsa level oshishi kerak.

## Nima qilish kerak

Har player uchun:

level_before yoziladi\
earned_xp hisoblanadi\
player_stats.xp yangilanadi\
level_after hisoblanadi

MVP uchun oddiy level formula:

level 1: 0 XP\
level 2: 100 XP\
level 3: 250 XP\
level 4: 450 XP\
level 5: 700 XP

Yoki formula:

required_xp = level \* level \* 100

Bitta usul tanlanadi va backendda bitta function qilinadi.

## Tekshirish kerak

XP qo'shiladi\
level_before va level_after saqlanadi\
XP yetarli bo'lsa level oshadi\
XP yetarli bo'lmasa level o'zgarmaydi

# 30-task: Match natijalarini databasega yozish

## Maqsad

Match tugagandan keyin barcha natijalar DBga yozilishi kerak.

## Nima qilish kerak

matches yangilanadi:

status\
started_at\
ended_at\
winner_team_id

teams yangilanadi:

is_winner\
placement

match_players yangilanadi:

kills\
deaths\
assists\
damage_dealt\
healing_done\
survived_seconds\
team_xp_earned\
performance_xp_earned\
total_xp_earned\
level_before\
level_after\
xp_breakdown\
status\
left_at

player_stats yangilanadi:

xp\
level\
total_matches\
wins\
losses\
kills\
deaths\
assists\
damage_dealt\
healing_done

## Tekshirish kerak

match tugagandan keyin matches FINISHED bo'ladi\
winner_team_id yoziladi\
match_players statistikasi to'ldiriladi\
player_stats umumiy statistikasi yangilanadi\
result screen uchun kerakli barcha ma'lumot bor

# 31-task: Result screen API/socket

## Maqsad

Match tugagandan keyin player natijani ko'ra olishi kerak.

## Nima qilish kerak

Endpoint:

GET /matches/:matchId/result

Qaytadigan ma'lumotlar:

Victory / Defeat\
winner team\
player team\
role\
kills\
deaths\
assists\
damage_dealt\
healing_done\
survived_seconds\
team_xp\
performance_xp\
total_xp\
level_before\
level_after

Socket orqali ham match_ended eventida result yuborilishi mumkin.

## Tekshirish kerak

match tugagach result screen ochiladi\
winner player Victory ko'radi\
loser player Defeat ko'radi\
XP to'g'ri ko'rinadi\
level oldin/keyin ko'rinadi

# 32-task: Frontend main menu

## Maqsad

User o'yinga kirganda asosiy menyuni ko'rishi kerak.

## Nima qilish kerak

Main menu elementlari:

Play\
Join by Code\
Profile / Stats\
Settings\
Exit

MVPda asosiy ishlaydiganlari:

Play\
Join by Code\
Profile / Stats

## Tekshirish kerak

main menu ochiladi\
Play bosilganda lobby yaratish oynasi ochiladi\
Join by Code bosilganda code input chiqadi\
Profile stats ko'rinadi

# 33-task: Frontend lobby screen

## Maqsad

Lobby ichidagi barcha holat userga aniq ko'rinishi kerak.

## Nima qilish kerak

Lobby screen ko'rsatadi:

lobby code\
players count\
teams\
playerlar\
role tanlash\
ready tugmasi\
countdown\
start shartlari

Har player row:

username\
team\
role\
ready status

## Tekshirish kerak

lobby code ko'rinadi\
2-browser kirganda playerlar ro'yxati yangilanadi\
team tanlash ishlaydi\
role tanlash ishlaydi\
ready bosish ishlaydi\
countdown real-time ko'rinadi

# 34-task: Frontend team selection UI

## Maqsad

User lobbyda team tanlay olishi kerak.

## Nima qilish kerak

UI elementlar:

Create Team\
Join Team\
Leave Team\
Solo

Team card:

team name\
player count\
players list\
join button

## Tekshirish kerak

user team yaratadi\
user teamga qo'shiladi\
solo qoladi\
team 4 playerdan oshmaydi\
team o'zgarsa real-time ko'rinadi

# 35-task: Frontend role selection UI

## Maqsad

User rolelarni ko'rib tanlay olishi kerak.

## Nima qilish kerak

Role cardlar:

Warrior\
Archer\
Healer\
Mage

Har birida:

HP\
Damage\
Range\
Skill\
qisqa tavsif

## Tekshirish kerak

4 ta role ko'rinadi\
role tanlanganda selected holat chiqadi\
backendga role_id yuboriladi\
lobbyda player role yangilanadi

# 36-task: Frontend match HUD

## Maqsad

Match ichida user kerakli ma'lumotlarni ko'rib turishi kerak.

## Nima qilish kerak

HUD:

HP bar\
role\
skill cooldown\
team info\
alive teams count\
task text

MVPda minimap shart emas.

## Tekshirish kerak

HP kamayganda HUD yangilanadi\
skill ishlatilganda cooldown ko'rinadi\
player o'lsa dead holat ko'rinadi\
task matni ko'rinadi

# 37-task: Leave/disconnect handling

## Maqsad

User lobbydan yoki matchdan chiqib ketsa tizim buzilmasligi kerak.

## Nima qilish kerak

Lobbyda chiqsa:

match_players olib tashlanadi yoki LEFT qilinadi\
team bo'sh qolsa o'chiriladi\
countdown shartlari qayta tekshiriladi

Match ACTIVE paytida chiqsa:

player DISCONNECTED yoki LEFT\
gameplayda DEAD hisoblanadi\
team elimination qayta tekshiriladi\
winner checking ishlaydi

## Tekshirish kerak

lobbyda player chiqsa boshqa playerlarda ro'yxat yangilanadi\
countdown kerak bo'lsa cancel bo'ladi\
matchda player chiqsa DEAD hisoblanadi\
agar oxirgi player bo'lsa team eliminated bo'ladi

# 38-task: Error handling va validation

## Maqsad

Noto'g'ri harakatlar backendni buzmasligi kerak.

## Nima qilish kerak

Validationlar:

noto'g'ri lobby code\
to'lgan lobby\
boshlangan matchga qo'shilish\
team full\
role noto'g'ri\
ready sharti bajarilmagan\
dead player attack qilishi\
same teamga damage berish\
match finisheddan keyin harakat

## Tekshirish kerak

noto'g'ri requestlar serverni crash qilmaydi\
frontendda tushunarli error chiqadi\
backend logda xatolar ko'rinadi

# 39-task: Minimal dev/test mode

## Maqsad

Dasturchi o'yinni oson test qila olishi kerak.

## Nima qilish kerak

Test uchun:

guest login tez ishlashi\
Chrome + Incognito bilan 2 player test qilish\
dev panel yoki console loglar

Ixtiyoriy:

DEV_MODE=true bo'lsa countdown 10 sekund bo'lishi mumkin

## Tekshirish kerak

1-dasturchi 2 browser bilan match boshlay oladi\
guest userlar tez yaratiladi\
test qilish uchun uzun register shart emas\
countdown dev modeda qisqartiriladi

# 40-task: Full MVP test scenario

## Maqsad

O'yin boshidan oxirigacha ishlashini tekshirish.

## Test qilish ketma-ketligi

1\. Chrome orqali Guest Player 1 kiradi\
2. Lobby yaratadi\
3. Lobby code oladi\
4. Incognito orqali Guest Player 2 kiradi\
5. Code orqali lobbyga qo'shiladi\
6. Player 1 solo teamda qoladi\
7. Player 2 boshqa solo team yaratadi\
8. Player 1 Warrior tanlaydi\
9. Player 2 Archer tanlaydi\
10. Ikkalasi Ready bosadi\
11. Countdown boshlanadi\
12. Match start bo'ladi\
13. Ikkala player xaritada ko'rinadi\
14. Player 1 harakatlanadi, Player 2 ekranida ko'rinadi\
15. Player 2 attack qiladi\
16. Player 1 HP kamayadi\
17. Player 1 Player 2 ni o'ldiradi\
18. Player 2 DEAD bo'ladi\
19. Team 2 eliminated bo'ladi\
20. Player 1 team winner bo'ladi\
21. Match FINISHED bo'ladi\
22. XP hisoblanadi\
23. Result screen chiqadi\
24. Database'da match natijasi yoziladi\
25. Profile stats yangilanadi

## Tekshirish kerak

shu flow boshidan oxirigacha xatosiz ishlasa MVP gameplay ishlayapti

# 41-task: MVP yakuniy audit

## Maqsad

Scope creep bo'lmasligi va MVP haqiqatan tayyorligini tekshirish.

## Tekshirish kerak bo'lgan narsalar

Guest login ishlaydi\
Register/login ishlaydi\
Lobby yaratish ishlaydi\
Lobby code ishlaydi\
Team tanlash ishlaydi\
Role tanlash ishlaydi\
Ready ishlaydi\
Countdown ishlaydi\
Match start ishlaydi\
Map/spawn ishlaydi\
Movement sync ishlaydi\
Attack/damage ishlaydi\
Heal ishlaydi\
Death ishlaydi\
Team elimination ishlaydi\
Winner aniqlanadi\
XP hisoblanadi\
Level yangilanadi\
Result screen chiqadi\
Stats DBga yoziladi\
2 browser orqali to'liq o'ynab bo'ladi

Agar yuqoridagilarning hammasi ishlasa:

Maze Champions MVP tugagan hisoblanadi.

# MVPga kirmaydigan narsalar

Bu tasklarga quyidagilarni aralashtirmaslik kerak:

friend list\
friend request\
direct invite notification\
territory control\
alliance\
mobs\
boss\
ranking\
season\
skins\
inventory\
battle pass\
custom room\
spectator mode\
advanced anti-cheat\
advanced minimap\
voice chat

Bular keyingi versiyalar uchun.

# Eng muhim ishlab chiqish tartibi

Ishni mana shu ketma-ketlikda qilish kerak:

1\. Project setup\
2. Database\
3. Seed data\
4. Auth / Guest\
5. Lobby code\
6. Socket lobby\
7. Team / Role / Ready\
8. Countdown\
9. GameState\
10. Map / Spawn\
11. Movement\
12. Combat\
13. Death / Winner\
14. XP / Stats\
15. Result screen\
16. Full test

Shu tartib buzilmasa, loyiha chalkashib ketmaydi.
