# Maze Champions MVP --- To'liq Match Flow

## 1. Match flow nima?

**Match flow** --- bu bitta o'yin partiyasi qanday yaratilishi, qanday
boshlanishi, match ichida nima bo'lishi va qanday tugashini
ko'rsatadigan ketma-ketlik.

Maze Champions MVP da bitta match quyidagi asosiy bosqichlardan iborat
bo'ladi:

1\. Match yaratiladi\
2. Lobby ochiladi\
3. Playerlar lobbyga kiradi\
4. Teamlar shakllanadi\
5. Role tanlanadi\
6. Ready holati tekshiriladi\
7. Countdown boshlanadi\
8. Xarita yaratiladi\
9. Teamlar spawn qilinadi\
10. Match active bo'ladi\
11. Playerlar harakatlanadi va jang qiladi\
12. Death va team elimination hisoblanadi\
13. Winner aniqlanadi\
14. XP/statistika hisoblanadi\
15. Natija databasega yoziladi\
16. Result screen ko'rsatiladi

# 2. Match yaratish bosqichi

Match user **Lobby yaratish** tugmasini bosganda yaratiladi.

Bu vaqtda tizim yangi match yozuvini yaratadi.

Boshlang'ich match holati:

status: WAITING\
mode: SURVIVAL\
task: LAST_TEAM_ALIVE\
min_players: 2\
min_teams: 2\
max_players: 12\
team_size_min: 1\
team_size_max: 4\
countdown_seconds: 60

Shu match uchun unique lobby code yaratiladi.

Masalan:

lobby_code: AB12CD

Bu code orqali boshqa playerlar aynan shu match lobbyga qo'shila oladi.

# 3. Lobby ochilishi

Match yaratilgandan keyin lobby ochiladi.

Lobby holati:

Match status: WAITING\
Player count: 1 / 12\
Team count: 0 yoki 1\
Countdown: boshlanmagan

Lobby ichida quyidagilar ko'rinadi:

\- Lobby code\
- Match mode\
- Task\
- Playerlar ro'yxati\
- Teamlar ro'yxati\
- Role tanlash\
- Ready holati

Bu bosqichda match hali boshlanmagan bo'ladi.

# 4. Playerlar lobbyga kirishi

Playerlar lobbyga 2 xil yo'l bilan kiradi:

1\. Lobby yaratish orqali\
2. Lobby code orqali qo'shilish orqali

Har bir player lobbyga kirganda tizim tekshiradi:

\- Lobby mavjudmi?\
- Match status WAITING yoki COUNTDOWN holatidami?\
- Match hali ACTIVE bo'lib ketmaganmi?\
- Match to'lib ketmaganmi?\
- User allaqachon shu matchda yo'qmi?

Agar hammasi to'g'ri bo'lsa, player matchga qo'shiladi.

Player uchun match_players yozuvi yaratiladi, lekin hali team va role
tanlanmagan bo'lishi mumkin.

Boshlang'ich holat:

player_status: WAITING\
team_id: null\
role_id: null\
is_ready: false

# 5. Team shakllanishi

Lobby ichida har bir player team tanlaydi.

Playerda 3 ta variant bor:

1\. Mavjud teamga qo'shilish\
2. Yangi team yaratish\
3. Solo qolish

Solo qolish ham texnik tomondan alohida team hisoblanadi.

Masalan:

Player 1 solo qolsa → Team 1 yaratiladi\
Player 2 solo qolsa → Team 2 yaratiladi

Team qoidalari:

\- Har bir teamda minimum 1 ta player bo'ladi\
- Har bir teamda maksimum 4 ta player bo'ladi\
- MVP da bir xil role bir teamda takrorlanishi mumkin\
- Match boshlangandan keyin team o'zgartirib bo'lmaydi

# 6. Role tanlash bosqichi

Team tanlangandan keyin player role tanlaydi.

MVP rolelar:

Warrior\
Archer\
Healer\
Mage / Sehrgar

Role tanlanganda match_players.role_id yangilanadi.

Masalan:

Player 1 → Team Blue → Warrior\
Player 2 → Team Red → Archer

Role tanlanmaguncha player Ready bo'la olmaydi.

# 7. Ready bosqichi

Player team va role tanlagandan keyin **Ready** bosadi.

Ready bosilganda tizim tekshiradi:

\- Player match ichidami?\
- Player team tanlaganmi?\
- Player role tanlaganmi?\
- Match hali boshlanmaganmi?

Agar hammasi to'g'ri bo'lsa:

is_ready: true

Lobbyda player holati shunday ko'rinadi:

Player 1 --- Team Blue --- Warrior --- Ready\
Player 2 --- Team Red --- Archer --- Ready

# 8. Match boshlanish shartlarini tekshirish

Tizim har safar player kirganda, chiqqanda, team o'zgartirganda, role
tanlaganda yoki Ready bosganda match start shartlarini tekshiradi.

Match boshlanishi uchun shartlar:

1\. Kamida 2 ta player bo'lishi kerak\
2. Kamida 2 ta team bo'lishi kerak\
3. Har bir player teamga biriktirilgan bo'lishi kerak\
4. Har bir player role tanlagan bo'lishi kerak\
5. Har bir player Ready bo'lgan bo'lishi kerak\
6. Match status WAITING bo'lishi kerak

Misollar:

1 player → match boshlanmaydi\
2 player, 1 team → match boshlanmaydi\
2 player, 2 team → match boshlanishi mumkin\
4 player, 1 team → match boshlanmaydi\
4 player, 2 team → match boshlanishi mumkin

# 9. Countdown boshlanishi

Agar barcha start shartlari bajarilsa, match status quyidagiga o'tadi:

status: COUNTDOWN

60 soniyalik countdown boshlanadi.

Match 60 soniyadan keyin boshlanadi

Countdown vaqtida playerlar hali lobbyda bo'ladi.

Countdown paytida ruxsat beriladi:

\- yangi player qo'shilishi, agar lobby to'lmagan bo'lsa\
- teamni o'zgartirish\
- role o'zgartirish\
- Ready holatini o'zgartirish

Lekin agar countdown vaqtida start shartlari buzilsa, countdown
to'xtaydi.

Masalan:

Player 2 chiqib ketdi\
Endi faqat 1 player qoldi\
Countdown cancel bo'ladi\
Match status yana WAITING bo'ladi

Yoki:

2 ta player bor edi\
Ikkalasi bitta teamga o'tib oldi\
Min teams = 2 sharti buzildi\
Countdown cancel bo'ladi

# 10. Match start bosqichi

Countdown 0 ga yetganda match boshlanadi.

Tizim oxirgi marta start shartlarini tekshiradi.

Agar shartlar hali ham to'g'ri bo'lsa:

status: ACTIVE\
started_at: current time

Shu paytdan boshlab:

\- lobbyga yangi player qo'shilmaydi\
- team o'zgartirish mumkin emas\
- role o'zgartirish mumkin emas\
- Ready holati o'zgarmaydi

# 11. Xarita tayyorlash

Match boshlanishida labirint xarita seed asosida yaratiladi.

MVP da bitta asosiy map bo'ladi.

Map qoidalari:

\- map seed asosida yaratiladi\
- bir xil seed bo'lsa, bir xil labirint chiqadi\
- mapda 12 ta spawn point bo'ladi\
- teamlar soniga qarab spawn pointlar tanlanadi

Masalan:

Map: Classic Maze\
Seed: maze_classic_001\
Spawn points: 12 ta

# 12. Teamlarni spawn qilish

Har bir team bitta spawn pointga joylashtiriladi.

Tizim spawn point tanlashda teamlarni imkon qadar bir-biridan uzoq
joylashtiradi.

Masalan:

Team Blue → Spawn 1\
Team Red → Spawn 7\
Team Green → Spawn 4

Bitta teamdagi playerlar bir spawn atrofida paydo bo'ladi.

Har bir player tanlagan role statlari bilan boshlaydi.

Masalan:

Warrior:\
HP 120\
Damage 25\
\
Archer:\
HP 90\
Damage 20\
\
Healer:\
HP 100\
Damage 10\
\
Mage:\
HP 80\
Damage 30

# 13. Task e'lon qilish

Match active bo'lganda MVP task e'lon qilinadi:

Task: Oxirigacha tirik qol.\
Oxirida tirik qolgan team g'olib bo'ladi.

MVP da faqat bitta task bor:

LAST_TEAM_ALIVE

Ya'ni winner sharti:

Faqat bitta teamda tirik player qolsa, o'sha team g'olib bo'ladi.

# 14. Match active bosqichi

Match active bo'lgandan keyin playerlar labirintda harakatlanadi va jang
qiladi.

Bu bosqichda asosiy tizimlar ishlaydi:

\- movement sync\
- attack sync\
- damage calculation\
- HP update\
- heal\
- death\
- team elimination\
- winner checking

Real-time holatlar server memoryda saqlanadi.

Databasega har bir yurish yozilmaydi.

Databasega faqat match yakuniy natijalari yoziladi.

# 15. Movement flow

Player harakat qilganda frontend serverga signal yuboradi.

Masalan:

event: player_move\
data:\
- position_x\
- position_y\
- position_z\
- rotation\
- velocity

Server tekshiradi:

\- match ACTIVE holatidami?\
- player tirikmi?\
- player shu match ichidami?\
- player devor ichidan o'tmayaptimi?\
- player juda tez yurmayaptimi?

Agar harakat to'g'ri bo'lsa, server boshqa playerlarga yangilangan
pozitsiyani yuboradi.

# 16. Attack flow

Player attack qilganda frontend serverga signal yuboradi.

Masalan:

event: player_attack\
data:\
- attack_type\
- direction\
- target_id

Server tekshiradi:

\- match ACTIVE holatidami?\
- player tirikmi?\
- attack cooldown tugaganmi?\
- player role bu attackni ishlata oladimi?\
- target range ichidami?\
- target dushman teamdanmi?

Agar attack valid bo'lsa:

\- damage hisoblanadi\
- target HP kamayadi\
- attacker damage_dealt statistikasi oshadi\
- kerak bo'lsa target DEAD bo'ladi\
- natija barcha playerlarga yuboriladi

# 17. Heal flow

Healer heal ishlatganda server tekshiradi:

\- healer tirikmi?\
- heal cooldown tugaganmi?\
- target o'z teamidanmi?\
- target range ichidami?\
- target tirikmi?

Agar heal valid bo'lsa:

target_hp = target_hp + heal_amount

Lekin HP role max HP dan oshib ketmasligi kerak.

Masalan:

Warrior max HP: 120\
Current HP: 110\
Heal: 20\
Final HP: 120

Healerning healing_done statistikasi oshadi.

# 18. Damage / HP hisoblash

Har bir playerda match davomida current_hp bo'ladi.

Damage olganda:

current_hp = current_hp - damage

Agar HP 0 dan katta bo'lsa:

player tirik qoladi

Agar HP 0 yoki undan past bo'lsa:

player DEAD bo'ladi

Misol:

Archer HP: 90\
Warrior damage: 25\
\
1-attack: 90 - 25 = 65\
2-attack: 65 - 25 = 40\
3-attack: 40 - 25 = 15\
4-attack: 15 - 25 = 0 yoki past\
\
Archer DEAD

# 19. Death bosqichi

Player HP 0 bo'lsa, death holati ishlaydi.

Death bo'lganda:

\- player status DEAD bo'ladi\
- deaths +1 bo'ladi\
- killer kills +1 oladi\
- assist bo'lsa assists +1 yoziladi\
- player endi harakatlana olmaydi\
- player attack qila olmaydi\
- player heal qila olmaydi

MVP da respawn yo'q.

Ya'ni player o'lsa, match tugaguncha qayta tirilmaydi.

# 20. Team elimination

Har safar player o'lganda tizim uning teamini tekshiradi.

Agar teamda tirik player qolmasa:

team eliminated bo'ladi

Misol:

Team Blue:\
Player 1 --- DEAD\
Player 2 --- DEAD\
\
Team Blue eliminated

Agar teamda kamida bitta player tirik bo'lsa, team hali eliminated emas.

Team Red:\
Player 3 --- DEAD\
Player 4 --- ALIVE\
\
Team Red hali o'yinda

# 21. Winner checking

Har bir death yoki team eliminationdan keyin tizim winner shartini
tekshiradi.

Survival MVP winner sharti:

Agar faqat bitta teamda tirik player qolsa, o'sha team winner bo'ladi.

Misol:

Team Blue --- eliminated\
Team Red --- alive\
Team Green --- eliminated\
\
Winner: Team Red

Agar hali 2 yoki undan ko'p teamda tirik player bo'lsa, match davom
etadi.

# 22. Match tugashi

Winner aniqlanganda match tugaydi.

Tizim quyidagilarni bajaradi:

status: FINISHED\
winner_team_id: winner team\
ended_at: current time

Shu paytdan boshlab:

\- player move ishlamaydi\
- attack ishlamaydi\
- heal ishlamaydi\
- match result hisoblanadi

# 23. Statistika hisoblash

Match tugagandan keyin har bir player uchun statistikalar hisoblanadi.

Har bir player bo'yicha:

\- selected role\
- team\
- kills\
- deaths\
- assists\
- damage_dealt\
- healing_done\
- survived_seconds\
- is_winner

Har bir team bo'yicha:

\- placement\
- is_winner\
- eliminated yoki winner

# 24. XP hisoblash

XP ikki qismdan hisoblanadi:

1\. Team reward\
2. Personal performance reward

## Team reward

Winner teamga umumiy 100 XP beriladi.

Bu XP teamdagi playerlar soniga bo'linadi.

1 kishilik winner team → 100 XP\
2 kishilik winner team → 50 XP dan\
4 kishilik winner team → 25 XP dan

Yutqazgan teamlarga team reward berilmaydi.

## Personal performance reward

Har bir player o'z harakatiga qarab XP oladi.

Formula:

Kill: +10 XP\
Assist: +5 XP\
Damage: +0.1 XP har 10 damage uchun\
Heal: +0.1 XP har 10 heal uchun\
Survival time: +1 XP har 60 soniya uchun\
Objective: +20 XP

Final XP:

total_xp = team_reward + performance_xp

# 25. Level hisoblash

Player olgan XP uning umumiy XP siga qo'shiladi.

Masalan:

old_xp: 230\
earned_xp: 45\
new_xp: 275

Agar yangi XP keyingi level chegarasiga yetsa, level oshadi.

Match player uchun saqlanadi:

level_before\
level_after\
total_xp_earned

# 26. Natijalarni databasega yozish

Match tugagach natijalar databasega yoziladi.

matches jadvalida:

status = FINISHED\
started_at\
ended_at\
winner_team_id

teams jadvalida:

placement\
is_winner

match_players jadvalida:

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
xp_breakdown

player_stats jadvalida umumiy statistikalar yangilanadi:

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

# 27. Result screen bosqichi

Databasega yozilgandan keyin playerlarga result screen ko'rsatiladi.

Result screen ma'lumotlari:

Victory yoki Defeat\
Winner team\
Player team\
Selected role\
Kills\
Deaths\
Assists\
Damage dealt\
Healing done\
Survived time\
Team XP\
Performance XP\
Total XP\
Level before\
Level after

Tugmalar:

Play Again\
Main Menu\
Exit

# 28. Player lobbydan chiqib ketsa

Agar player match boshlanishidan oldin lobbydan chiqib ketsa:

\- player lobbydan olib tashlanadi\
- agar countdown ketayotgan bo'lsa, start shartlari qayta tekshiriladi\
- agar player yoki team yetmay qolsa, countdown cancel bo'ladi

Agar lobbyda hech kim qolmasa:

match status = CANCELLED

# 29. Player match paytida chiqib ketsa

Agar match ACTIVE vaqtida player chiqib ketsa:

MVP uchun oddiy qoida:

chiqib ketgan player DEAD hisoblanadi

Shunda:

\- player status LEFT yoki DISCONNECTED bo'ladi\
- gameplayda u DEAD sifatida ko'riladi\
- agar teamda boshqa tirik player qolmasa, team eliminated bo'ladi\
- winner checking qayta ishlaydi

Bu MVP uchun eng sodda va tushunarli yechim.

# 30. Match statuslari

MVP da match quyidagi statuslardan foydalanadi:

WAITING\
COUNTDOWN\
ACTIVE\
FINISHED\
CANCELLED

Ularning ma'nosi:

WAITING:\
Lobby ochiq, playerlar qo'shilyapti.\
\
COUNTDOWN:\
Start shartlari bajarilgan, 60 soniyalik timer ketmoqda.\
\
ACTIVE:\
Match boshlangan, playerlar harakatlanib jang qilyapti.\
\
FINISHED:\
Winner aniqlangan, match tugagan.\
\
CANCELLED:\
Match boshlanmasdan bekor qilingan.

# 31. Match flow qisqa ko'rinishi

User lobby yaratadi\
→ Match WAITING holatda yaratiladi\
→ Lobby code beriladi\
→ Playerlar code orqali qo'shiladi\
→ Team tanlanadi yoki solo team yaratiladi\
→ Role tanlanadi\
→ Playerlar Ready bosadi\
→ Tizim min 2 player va min 2 team shartini tekshiradi\
→ Shartlar bajarilsa COUNTDOWN boshlanadi\
→ Countdown 0 bo'lsa match ACTIVE bo'ladi\
→ Map seed asosida yaratiladi\
→ Teamlar spawn pointlarga joylashtiriladi\
→ Task e'lon qilinadi\
→ Playerlar harakatlanadi va jang qiladi\
→ HP, damage, heal, death hisoblanadi\
→ Teamlar eliminated bo'ladi\
→ Faqat bitta team tirik qolsa winner aniqlanadi\
→ Match FINISHED bo'ladi\
→ XP/statistika hisoblanadi\
→ Natijalar databasega yoziladi\
→ Result screen chiqadi

# 32. MVP uchun eng muhim qoida

Maze Champions MVP match flowda eng asosiy qoida shu:

Real-time holat server memoryda turadi.\
Database faqat match natijasi va statistikani saqlaydi.

Ya'ni:

DBga yozilmaydi:\
- har bir qadam\
- har soniyadagi pozitsiya\
- kamera aylanishi\
- har bir kichik movement\
\
DBga yoziladi:\
- match boshlanishi\
- match tugashi\
- winner\
- teamlar\
- player role\
- kill/death/assist\
- damage/heal\
- XP\
- level\
- umumiy statistika
