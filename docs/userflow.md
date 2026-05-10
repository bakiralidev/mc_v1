# Maze Champions MVP --- To'liq User Flow

## 1. Umumiy tushuncha

**Maze Champions** MVP versiyada o'yinchilar labirint xaritada
**Survival** rejimida o'ynaydi. Matchda 8--12 tagacha player bo'lishi
mumkin, lekin test va MVP uchun kamida **2 ta player** va kamida **2 ta
team** bo'lsa match boshlanishi mumkin.

O'yinchilar solo yoki 1--4 kishilik team bo'lib o'ynaydi. Match boshida
hamma player role tanlaydi. MVP da 4 ta role bo'ladi:

Warrior\
Archer\
Healer\
Mage / Sehrgar

MVP dagi asosiy task:

Oxirigacha tirik qolgan team g'olib bo'ladi.

# 2. Asosiy menyu flow

User o'yinga kirganda birinchi **main menu** ko'radi.

Main menu ichida MVP uchun quyidagi tugmalar bo'ladi:

Play\
Join by Code\
Profile / Stats\
Settings\
Exit

MVP uchun eng muhim tugmalar:

Play\
Join by Code

# 3. Kirish flow: Login yoki Guest

User o'yinga birinchi marta kirganda 2 xil variant bo'ladi:

1\. Login / Register\
2. Guest sifatida kirish

## 3.1. Guest sifatida kirish

Agar user tez test qilmoqchi bo'lsa, **Guest sifatida kirish** tugmasini
bosadi.

Tizim vaqtinchalik guest user yaratadi.

Masalan:

Guest_4821

Guest user ham matchga kira oladi, lobby yaratadi, role tanlaydi va
o'ynaydi. Lekin keyinchalik account qilmasa, statistikasi yo'qolishi
yoki vaqtinchalik saqlanishi mumkin.

## 3.2. Login / Register

Agar user ro'yxatdan o'tsa yoki login qilsa, uning XP, level va
statistikalari doimiy saqlanadi.

MVP uchun login oddiy bo'lishi mumkin:

username\
email\
password

# 4. Play tugmasi flow

User **Play** tugmasini bosganda unga 2 ta asosiy variant chiqadi:

1\. Lobby yaratish\
2. Code orqali matchga qo'shilish

Bu yerda muhim narsa:

Lobby code faqat bitta match/lobbyga kirish uchun ishlatiladi.\
Lobby code userni majburan bitta teamga qo'shmaydi.\
Team tanlash lobby ichida alohida qilinadi.

# 5. Lobby yaratish flow

## 5.1. User lobby yaratadi

User **Lobby yaratish** tugmasini bosadi.

Tizim yangi match yaratadi.

Match boshlang'ich holatda quyidagicha bo'ladi:

status: WAITING\
mode: SURVIVAL\
task: LAST_TEAM_ALIVE\
min_players: 2\
min_teams: 2\
max_players: 12\
team_size: 1--4

Tizim shu match uchun unique lobby code yaratadi.

Masalan:

AB12CD

Userga ekranda quyidagicha ko'rsatiladi:

Lobby yaratildi\
\
Do'stlaringizni chaqirish kodi:\
AB12CD\
\
Bu kodni do'stlaringizga yuboring.\
Ular \"Code orqali qo'shilish\" bo'limidan shu kodni kiritib sizning
match/lobbyingizga kira oladi.

# 6. Code orqali qo'shilish flow

## 6.1. Ikkinchi user matchga qo'shiladi

Ikkinchi user asosiy menyudan:

Join by Code

yoki

Play → Code orqali qo'shilish

tugmasini bosadi.

Keyin input chiqadi:

Lobby code kiriting

User kodni kiritadi:

AB12CD

## 6.2. Tizim code tekshiradi

Tizim quyidagilarni tekshiradi:

\- Bunday lobby code mavjudmi?\
- Match status WAITING yoki COUNTDOWN holatidami?\
- Match hali boshlanmaganmi?\
- Match to'lib ketmaganmi?\
- User allaqachon shu match ichida emasmi?

Agar code noto'g'ri bo'lsa:

Bunday lobby topilmadi.

Agar match allaqachon boshlangan bo'lsa:

Bu match allaqachon boshlangan.

Agar match to'lgan bo'lsa:

Bu lobby to'lgan.

Agar hammasi to'g'ri bo'lsa, user lobbyga kiradi.

# 7. Lobby ichidagi flow

Lobbyga kirgan har bir user quyidagi ma'lumotlarni ko'radi:

Lobby code\
Match mode\
Task\
Playerlar ro'yxati\
Teamlar ro'yxati\
Role tanlash joyi\
Ready tugmasi\
Start / countdown holati

Masalan:

Lobby code: AB12CD\
Mode: Survival\
Task: Oxirigacha tirik qol\
\
Players: 2 / 12\
Teams: 2\
Minimum start: 2 players, 2 teams

# 8. Team tanlash flow

Lobbyga kirgan user 3 xil tanlovga ega bo'ladi:

1\. Mavjud teamga qo'shilish\
2. Yangi team yaratish\
3. Solo qolish

## 8.1. Mavjud teamga qo'shilish

Agar lobbyda boshqa user team yaratgan bo'lsa, yangi kirgan user shu
teamga qo'shilishi mumkin.

Shart:

Team ichida 4 tadan ko'p player bo'lmasligi kerak.

Masalan:

Team Blue:\
- Player 1\
\
Player 2 \"Join Team Blue\" ni bossa:\
Team Blue:\
- Player 1\
- Player 2

## 8.2. Yangi team yaratish

User xohlasa alohida team ochishi mumkin.

Masalan:

Player 1 → Team Blue\
Player 2 → Team Red

Bu holda 2 ta team bor bo'ladi va Survival match boshlanishi mumkin.

## 8.3. Solo qolish

Solo qolish degani user o'zi alohida team bo'lib o'ynaydi.

Masalan:

Player 1 solo → Team 1\
Player 2 solo → Team 2

Texnik tomondan solo player ham team hisoblanadi. Faqat team ichida 1 ta
player bo'ladi.

# 9. Team qoidalari

MVP uchun team qoidalari:

\- Har bir teamda minimum 1 ta player bo'ladi.\
- Har bir teamda maksimum 4 ta player bo'ladi.\
- User lobby ichida teamini o'zgartira oladi.\
- Match boshlangandan keyin team o'zgartirish mumkin emas.\
- Bitta teamda bir xil role takrorlanishi mumkin.

Masalan, MVP da quyidagilar mumkin:

Team A:\
- Warrior\
- Warrior\
- Healer\
- Mage

yoki:

Team B:\
- Healer\
- Healer\
- Healer\
- Healer

Keyingi versiyada balance uchun cheklov qo'yilishi mumkin, lekin MVP da
cheklov yo'q.

# 10. Role tanlash flow

User team tanlagandan keyin role tanlaydi.

MVP rolelar:

Warrior\
Archer\
Healer\
Mage / Sehrgar

Har bir role ekranda qisqa tavsif bilan ko'rsatiladi.

Masalan:

Warrior\
HP: 120\
Damage: 25\
Range: yaqin\
Skill: sword attack + dash

Archer\
HP: 90\
Damage: 20\
Range: uzoq\
Skill: arrow attack + long shot

Healer\
HP: 100\
Damage: 10\
Heal: 20\
Skill: weak attack + heal

Mage\
HP: 80\
Damage: 30\
Range: o'rta/uzoq\
Skill: fireball + area blast

User role tanlagandan keyin uning lobbydagi holati yangilanadi:

Player 1 --- Team Blue --- Warrior --- Not Ready

# 11. Ready flow

Role tanlagandan keyin user **Ready** tugmasini bosadi.

Ready bo'lgandan keyin lobbyda shunday ko'rinadi:

Player 1 --- Team Blue --- Warrior --- Ready\
Player 2 --- Team Red --- Archer --- Ready

Agar user role tanlamagan bo'lsa, Ready bosolmaydi.

Xabar:

Avval role tanlang.

Agar user team tanlamagan bo'lsa, Ready bosolmaydi.

Xabar:

Avval team tanlang yoki solo qoling.

# 12. Match boshlanish shartlari

Match boshlanishi uchun quyidagi shartlar bajarilishi kerak:

1\. Kamida 2 ta player bo'lishi kerak.\
2. Kamida 2 ta team bo'lishi kerak.\
3. Har bir player teamga biriktirilgan bo'lishi kerak.\
4. Har bir player role tanlagan bo'lishi kerak.\
5. Har bir player Ready bo'lgan bo'lishi kerak.\
6. Match status WAITING yoki COUNTDOWN bo'lishi kerak.

Misollar:

1 player → match boshlanmaydi.\
2 player, 1 team → match boshlanmaydi.\
2 player, 2 team → match boshlanishi mumkin.\
4 player, 1 team → match boshlanmaydi.\
4 player, 2 team → match boshlanishi mumkin.\
12 player → lobby to'lgan hisoblanadi.

# 13. Countdown flow

Agar match boshlanish shartlari bajarilsa, tizim 60 soniyalik countdown
boshlaydi.

Match 60 soniyadan keyin boshlanadi.

Countdown vaqtida:

\- yangi player lobbyga qo'shilishi mumkin, agar joy bo'lsa;\
- player teamini o'zgartirishi mumkin;\
- player role o'zgartirishi mumkin;\
- player Ready holatini o'zgartirishi mumkin.

Lekin agar countdown vaqtida match boshlanish shartlari buzilsa,
countdown to'xtaydi.

Masalan:

Playerlardan biri chiqib ketdi.\
Endi faqat 1 player qoldi.\
Countdown bekor qilinadi.

Yoki:

2 ta player bor, lekin ikkalasi bitta teamga o'tib oldi.\
Minimum 2 team sharti buzildi.\
Countdown bekor qilinadi.

# 14. Match start flow

Countdown 0 ga yetganda tizim matchni boshlaydi.

Match boshlanishida quyidagilar bajariladi:

1\. Match status ACTIVE ga o'tadi.\
2. Lobbyga yangi player qo'shish yopiladi.\
3. Team va role o'zgartirish bloklanadi.\
4. Labirint xarita seed asosida yaratiladi.\
5. Teamlar spawn pointlarga joylashtiriladi.\
6. Har bir player tanlagan role statistikasi bilan spawn bo'ladi.\
7. Task e'lon qilinadi.

Task matni:

Task: Oxirigacha tirik qol.\
Oxirida tirik qolgan team g'olib bo'ladi.

# 15. Spawn flow

MVP xaritada 12 ta spawn point bo'ladi.

Har bir team bitta spawn pointga joylashtiriladi.

Qoidalar:

\- Teamlar bir-biridan nisbatan uzoq spawn qilinadi.\
- Agar teamlar kam bo'lsa, tizim eng uzoq spawn pointlarni tanlaydi.\
- Bitta teamdagi playerlar bir xil spawn point yaqinida paydo bo'ladi.

Masalan:

Team Blue → Spawn 1\
Team Red → Spawn 7\
Team Green → Spawn 4

# 16. Match ichidagi gameplay flow

Match active bo'lgandan keyin playerlar labirintda harakatlana
boshlaydi.

Gameplay ichida asosiy harakatlar:

\- player movement\
- camera rotation\
- attack\
- skill ishlatish\
- damage olish\
- heal olish\
- death\
- team elimination\
- winner aniqlash

Real-time holatlar Socket orqali yuradi.

Databasega har bir yurish yoki har bir kichik harakat yozilmaydi.

# 17. Movement flow

Player klaviatura yoki controller orqali harakat qiladi.

Frontend serverga harakat signalini yuboradi.

Masalan:

player_move\
position_x\
position_y\
position_z\
rotation\
velocity

Server quyidagilarni tekshiradi:

\- player tirikmi?\
- player match ichidami?\
- match ACTIVE holatidami?\
- player juda tez harakat qilmayaptimi?\
- collision / devor ichidan o'tib ketish yo'qmi?

Server tekshiruvdan keyin boshqa playerlarga yangilangan holatni
yuboradi.

# 18. Attack flow

Player attack tugmasini bosadi.

Frontend serverga attack signal yuboradi.

Masalan:

player_attack\
attack_type\
target_direction

Server quyidagilarni tekshiradi:

\- player tirikmi?\
- match ACTIVE holatidami?\
- attack cooldown tugaganmi?\
- player tanlagan role bu attackni qila oladimi?\
- raqib attack range ichidami?\
- zarba yo'nalishi to'g'rimi?

Agar attack to'g'ri bo'lsa:

\- damage hisoblanadi;\
- raqib HP kamayadi;\
- damage_dealt statistikasi oshadi;\
- boshqa playerlarga attack natijasi yuboriladi.

# 19. Damage / HP flow

Har bir player match boshlanganda role HP bilan boshlaydi.

Masalan:

Warrior: 120 HP\
Archer: 90 HP\
Healer: 100 HP\
Mage: 80 HP

Agar player damage olsa:

current_hp = current_hp - damage

Agar HP 0 dan katta bo'lsa, player tirik qoladi.

Agar HP 0 yoki undan past bo'lsa:

player status = DEAD

# 20. Death flow

Player HP 0 bo'lsa, u o'lgan hisoblanadi.

Death bo'lganda:

\- player status DEAD bo'ladi;\
- deaths statistikasi oshadi;\
- uni o'ldirgan playerning kills statistikasi oshadi;\
- agar assist bo'lsa, assist statistikasi yoziladi;\
- player matchda boshqa jang qilolmaydi;\
- agar teamdagi hamma player DEAD bo'lsa, team eliminated bo'ladi.

MVP da respawn bo'lmaydi.

Ya'ni player o'lsa, match tugaguncha qayta tirilmaydi.

# 21. Team elimination flow

Agar teamdagi barcha playerlar o'lsa, team eliminated bo'ladi.

Masalan:

Team Blue:\
- Player 1 DEAD\
- Player 2 DEAD\
\
Team Blue eliminated.

Team eliminated bo'lgandan keyin bu team g'olib bo'la olmaydi.

# 22. Winner aniqlash flow

Survival rejimida winner shunday aniqlanadi:

Agar faqat bitta teamda tirik player qolsa, shu team winner bo'ladi.

Masalan:

Team Blue --- eliminated\
Team Red --- alive\
Team Green --- eliminated\
\
Winner: Team Red

Agar matchda faqat 2 ta team bo'lsa va bittasi eliminated bo'lsa,
ikkinchisi avtomatik winner bo'ladi.

# 23. Match end flow

Winner aniqlangandan keyin:

1\. Match status FINISHED ga o'tadi.\
2. Winner team saqlanadi.\
3. Match ended_at vaqti yoziladi.\
4. Har bir player statistikasi hisoblanadi.\
5. XP hisoblanadi.\
6. Natijalar databasega yoziladi.\
7. Playerlar result screenga o'tkaziladi.

# 24. XP hisoblash flow

XP 2 qismdan iborat bo'ladi:

1\. Team reward\
2. Personal performance reward

## 24.1. Team reward

G'olib team uchun umumiy XP:

100 XP

Bu XP teamdagi playerlar soniga qarab taqsimlanadi.

Masalan:

1 kishilik winner team → 100 XP\
2 kishilik winner team → 50 XP dan\
4 kishilik winner team → 25 XP dan

Yutqazgan teamlarga team reward berilmaydi.

## 24.2. Personal performance reward

Har bir player o'z harakatiga qarab alohida XP oladi.

MVP formula:

Kill: +10 XP\
Assist: +5 XP\
Damage: +0.1 XP har 10 damage uchun\
Heal: +0.1 XP har 10 heal uchun\
Survival time: +1 XP har 60 soniya uchun\
Objective: +20 XP

MVP da objective XP faqat winner teamga berilishi mumkin.

Final XP:

total_xp = team_reward + personal_performance_reward

# 25. Level hisoblash flow

Match tugagandan keyin player olgan XP uning umumiy XP siga qo'shiladi.

Masalan:

old_xp = 230\
earned_xp = 45\
new_xp = 275

Agar yangi XP level chegarasidan o'tsa, level oshadi.

MVP uchun oddiy level tizimi bo'ladi:

Player umumiy XP yig'adi.\
XP kerakli chegaraga yetsa, level oshadi.

# 26. Result screen flow

Match tugagach userga result screen ko'rsatiladi.

Result screenda quyidagilar bo'ladi:

Victory / Defeat\
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
Old level\
New level

Pastda tugmalar:

Play Again\
Main Menu\
Exit

# 27. Play Again flow

Agar user **Play Again** tugmasini bossa:

\- yangi lobbyga kiradi yoki yangi match queuega tushadi;\
- eski matchga qaytmaydi;\
- yangi match uchun team va role qayta tanlanadi.

MVP da oddiyroq qilish mumkin:

Play Again → yangi lobby yaratadi.

# 28. User matchdan chiqib ketsa

Agar player lobby vaqtida chiqib ketsa:

\- u lobbydan olib tashlanadi;\
- agar countdown ketayotgan bo'lsa, start shartlari qayta tekshiriladi;\
- agar player soni yoki team soni yetmay qolsa, countdown bekor
qilinadi.

Agar player match active vaqtida chiqib ketsa:

\- uning statusi DISCONNECTED yoki LEFT bo'ladi;\
- MVP da u DEAD sifatida hisoblanishi mumkin;\
- agar teamda boshqa tirik player qolmasa, team eliminated bo'ladi.

MVP uchun eng oddiy yechim:

Match active vaqtida chiqib ketgan player DEAD hisoblanadi.

# 29. Minimal test flow

Dasturchi o'yinni o'zi test qilishi uchun eng oddiy test flow:

1\. Chrome orqali Guest Player 1 bo'lib kiradi.\
2. Lobby yaratadi.\
3. Lobby code oladi: AB12CD.\
4. Incognito yoki boshqa browser orqali Guest Player 2 bo'lib kiradi.\
5. Join by Code orqali AB12CD kiritadi.\
6. Player 1 alohida teamda qoladi.\
7. Player 2 alohida team yaratadi.\
8. Ikkalasi role tanlaydi.\
9. Ikkalasi Ready bosadi.\
10. Countdown boshlanadi.\
11. Match start bo'ladi.\
12. Ikkala player bir-birini xaritada ko'radi.\
13. Attack/damage/death test qilinadi.\
14. Bitta player o'lsa, ikkinchi team winner bo'ladi.\
15. Result screen chiqadi.\
16. XP va statistika DBga yoziladi.

# 30. MVP da bo'lmaydigan narsalar

Ushbu user flow MVP uchun yozilgan. Quyidagi narsalar MVP ga
kiritilmaydi:

\- friend list\
- friend request\
- direct invite notification\
- party system\
- territory control\
- alliance\
- mobs\
- boss\
- ranking\
- skin\
- inventory\
- battle pass\
- custom room settings\
- spectator mode

Do'st bilan o'ynash MVP da faqat **lobby code** orqali ishlaydi.

# 31. Yakuniy qisqa flow

Eng qisqa ko'rinishda Maze Champions MVP user flow:

User kiradi\
→ Login yoki Guest\
→ Main Menu\
→ Play\
→ Lobby yaratadi yoki code orqali qo'shiladi\
→ Team tanlaydi yoki solo qoladi\
→ Role tanlaydi\
→ Ready bosadi\
→ Minimum 2 player va 2 team bo'lsa countdown boshlanadi\
→ Match start\
→ Playerlar labirintda jang qiladi\
→ Teamlar eliminated bo'ladi\
→ Oxirgi tirik qolgan team winner bo'ladi\
→ XP/statistika hisoblanadi\
→ Natijalar DBga yoziladi\
→ Result screen chiqadi\
→ User yana o'ynaydi yoki main menuga qaytadi

Mana shu flow asosida endi bemalol **database modelni aniqroq
shakllantirish** mumkin.
