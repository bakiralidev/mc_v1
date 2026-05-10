Ha, aynan shunday qilamiz. MVP uchun **do'stlar ro'yxati/friend system
qilmaymiz**, o'rniga **Lobby Code** ishlatamiz.

Ya'ni "Do'st taklif qilish" tugmasi bosilganda oddiy kod chiqadi:

Lobby code: AB12CD

Do'sti esa "Matchga qo'shilish" tugmasini bosadi, shu kodni kiritadi va
aynan o'sha lobbyga kiradi.

# MVP uchun lobby code oqimi

## 1. User lobby yaratadi

User asosiy menyudan:

Play → Lobby yaratish

bosadi.

Tizim yangi match/lobby yaratadi va unga code beradi:

AB12CD

Userga ekranda chiqadi:

Do'stlaringizni chaqirish kodi: AB12CD

## 2. Do'sti code orqali kiradi

Ikkinchi user:

Play → Matchga qo'shilish

bosadi.

Keyin code kiritadi:

AB12CD

Agar code to'g'ri bo'lsa, u ham o'sha lobbyga tushadi.

## 3. Kirgandan keyin tanlov bo'ladi

Do'sti lobbyga kirgandan keyin 2 xil tanlov qiladi:

1\. Shu user bilan bitta teamga kirish\
2. Alohida team bo'lib o'ynash

Masalan:

Player 1 lobby yaratdi.\
Player 2 code bilan kirdi.\
\
Player 2 xohlasa Player 1 teamiga qo'shiladi.\
Xohlasa alohida team ochadi.

Bu juda yaxshi, chunki bitta code orqali bitta matchga tushadi, lekin
jamoa tanlash erkin qoladi.

# MVP uchun yakuniy qoida

Lobby code = bitta matchga kirish kodi.\
Team tanlash = lobby ichida alohida qilinadi.

Ya'ni lobby code jamoaga majburan qo'shmaydi. Faqat bitta o'yinga olib
kiradi.

# DBga nima qo'shamiz?

Hozirgi matches jadvaliga quyidagi fieldlarni qo'shamiz:

matches\
- lobby_code\
- created_by_user_id\
- min_players\
- min_teams\
- max_players\
- status

To'liqroq ko'rinishi:

matches\
- id\
- lobby_code\
- created_by_user_id\
- map_id\
- task_id\
- status\
- min_players\
- min_teams\
- max_players\
- seed\
- started_at\
- ended_at\
- winner_team_id\
- settings\
- created_at\
- updated_at

Muhim fieldlar:

lobby_code: AB12CD kabi unique code\
created_by_user_id: lobby yaratgan user\
min_players: 2\
min_teams: 2\
max_players: 12\
status: WAITING / COUNTDOWN / ACTIVE / FINISHED / CANCELLED

# Teams jadvali qanday ishlaydi?

Lobby ichida user team yaratishi yoki mavjud teamga qo'shilishi mumkin.

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

Match: AB12CD\
\
Team 1: Player 1\
Team 2: Player 2

yoki:

Match: AB12CD\
\
Team 1: Player 1 + Player 2

# Match players jadvali nima qiladi?

match_players jadvali qaysi user qaysi matchda, qaysi teamda va qaysi
role bilan ekanini saqlaydi.

match_players\
- id\
- match_id\
- team_id\
- user_id\
- role_id\
- status\
- is_ready\
- kills\
- deaths\
- assists\
- damage_dealt\
- healing_done\
- survived_seconds\
- total_xp_earned\
- joined_at\
- left_at

Bu yerda is_ready ham kerak bo'ladi. Chunki lobbyda player hali tayyor
yoki tayyor emasligini bilish kerak.

Masalan:

Player 1 role tanladi → Ready\
Player 2 hali role tanlamadi → Not ready

# Lobby boshlanish qoidasi

Match boshlanishi uchun:

Kamida 2 ta player bo'lishi kerak.\
Kamida 2 ta team bo'lishi kerak.\
Har bir player role tanlagan bo'lishi kerak.\
Countdown tugagan bo'lishi kerak.

Masalan:

1 player → boshlanmaydi\
2 player, 1 team → boshlanmaydi\
2 player, 2 team → boshlanadi\
4 player, 2 team → boshlanadi

Lekin agar 2 ta player bitta teamda bo'lsa, raqib yo'q bo'lgani uchun
Survival match boshlanmaydi.

# UI flow shunday bo'ladi

1\. User Play tugmasini bosadi\
2. Ekranda ikki variant chiqadi:\
- Lobby yaratish\
- Code orqali qo'shilish\
\
3. Lobby yaratgan userga code chiqadi:\
AB12CD\
\
4. Ikkinchi user code kiritadi\
\
5. Ikkalasi bitta lobbyga tushadi\
\
6. Har biri tanlaydi:\
- mavjud teamga qo'shilish\
- yangi team ochish\
- solo qolish\
\
7. Role tanlaydi\
\
8. Ready bo'ladi\
\
9. Kamida 2 team bo'lsa countdown boshlanadi\
\
10. Match start bo'ladi

# DB modelga yakuniy o'zgartirish

Demak, MVP DBda **friends/friend_requests/team_invites** hozircha
bo'lmaydi.

Buning o'rniga:

matches.lobby_code\
matches.created_by_user_id\
matches.min_players\
matches.min_teams\
match_players.is_ready

qo'shamiz.

Bu MVP uchun yetadi.

Keyinchalik haqiqiy friends system qo'shmoqchi bo'lsak, alohida
qo'shamiz:

friend_requests\
friendships\
party_invites\
team_invites

Lekin hozircha kerak emas. Hozirgi eng to'g'ri yechim: **Lobby Code
orqali bitta matchga kirish, keyin lobby ichida team tanlash**.
