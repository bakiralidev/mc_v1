# Maze Champions --- MVP Texnik Topshiriq / Game Design Document

## 1. Loyiha nomi

**Maze Champions**

## 2. Qisqa tavsif

**Maze Champions** --- Minecraft/blocky uslubidagi multiplayer labirint
arena o'yini. O'yinchilar solo yoki 1--4 kishilik jamoa bo'lib labirint
xaritaga tushadi, o'z rolini tanlaydi va match davomida raqib jamoalar
bilan jang qilib, oxirida tirik qolishga harakat qiladi.

MVP versiyada asosiy rejim: **Survival**. Ya'ni barcha jamoalar
bir-biriga dushman bo'ladi va oxirida tirik qolgan bitta jamoa g'olib
hisoblanadi.

## 3. O'yin konsepsiyasi

O'yinchilar labirint xaritaga tushadi. Har bir o'yinchi o'z rolini
tanlaydi: **Warrior**, **Archer**, **Healer** yoki **Sehrgar**.
O'yinchilar yakka holda yoki 1--4 kishilik jamoa bo'lib o'ynashi mumkin.

Match boshida o'yinchilarga bitta asosiy vazifa beriladi: **oxirigacha
tirik qolish**. Jamoalar labirint ichida harakatlanadi, raqiblarni
qidiradi, jang qiladi va omon qolishga harakat qiladi.

MVP versiyada hudud egallash, ittifoq tuzish va boshqa murakkab
vazifalar bo'lmaydi. Ular keyingi versiyalarda qo'shiladi.

## 4. Target auditoriya

O'yin quyidagi auditoriya uchun mo'ljallangan:

-   Minecraft, Roblox, Brawl Stars, battle royale va jamoaviy
    > multiplayer o'yinlarga qiziqadigan o'yinchilar;

-   10--25 yosh oralig'idagi casual va competitive gamerlar;

-   do'stlari bilan jamoa bo'lib o'ynashni yoqtiradigan
    > foydalanuvchilar;

-   tez boshlanadigan, qisqa matchli va taktikaga asoslangan o'yinlarni
    > yoqtiradiganlar.

## 5. MVP maqsadi

MVP versiyada 8--12 ta o'yinchi bitta labirint xaritada solo yoki 1--4
kishilik jamoa bo'lib jang qiladi.

O'yinchilar match oldidan jamoa va rol tanlaydi. Match boshlangach
barcha jamoalar bir-biriga qarshi jang qiladi. Oxirida tirik qolgan
jamoa g'olib bo'ladi. Match tugagach XP, level va asosiy statistika
saqlanadi.

MVP ning asosiy maqsadi --- o'yinning minimal, lekin ishlaydigan
multiplayer prototipini yaratish.

## 6. MVP chegarasi

MVP versiyada quyidagi tizimlar bo'ladi:

-   login yoki guest kirish;

-   asosiy menyu;

-   lobby;

-   team selection;

-   role selection;

-   60 soniyalik tayyorgarlik vaqti;

-   match start;

-   movement sync;

-   attack sync;

-   health/death tizimi;

-   match result;

-   XP hisoblash;

-   level/statistika saqlash.

MVP versiyada quyidagilar bo'lmaydi:

-   hudud egallash;

-   ittifoq tuzish;

-   boss;

-   maxluqlar;

-   ranking;

-   skin market;

-   battle pass;

-   inventory;

-   custom room;

-   murakkab chat tizimi.

## 7. O'yin rejimi

### MVP rejim: Survival

Survival rejimida barcha jamoalar bir-biriga dushman bo'ladi.

Qoidalar:

-   barcha jamoalar bir-biriga qarshi o'ynaydi;

-   boshqa jamoa bilan ittifoq tuzish mumkin emas;

-   boshqa jamoa bilan aloqa qilish imkoniyati bo'lmaydi;

-   oxirida tirik qolgan bitta jamoa g'olib bo'ladi;

-   g'olib jamoaga to'liq XP mukofoti beriladi.

MVP da faqat **bitta task** bo'ladi:

> Oxirigacha tirik qol va g'olib jamoa bo'l.

## 8. User flow

Foydalanuvchi o'yindan quyidagi ketma-ketlikda foydalanadi:

1.  User o'yinga kiradi.

2.  Login qiladi yoki guest sifatida kiradi.

3.  Asosiy menyuni ko'radi.

4.  Play tugmasini bosadi.

5.  Lobbyga kiradi.

6.  Team tanlaydi, auto teamga tushadi yoki solo qoladi.

7.  Role tanlaydi.

8.  60 soniya tayyorgarlik vaqti boshlanadi.

9.  Match taski e'lon qilinadi.

10. Match boshlanadi.

11. Playerlar labirint bo'ylab harakatlanadi.

12. Playerlar raqib jamoalar bilan jang qiladi va tirik qolishga harakat
    > qiladi.

13. G'olib jamoa aniqlanadi.

14. XP, level va statistika hisoblanadi.

15. Natija ekrani ko'rsatiladi.

16. User yana o'ynaydi yoki o'yindan chiqadi.

## 9. Match flow

Bitta match ichidagi jarayon quyidagicha bo'ladi:

1.  Match yaratiladi.

2.  Lobby ochiladi.

3.  Playerlar lobbyga kiradi.

4.  Teamlar shakllanadi.

5.  Playerlar role tanlaydi.

6.  60 soniyalik countdown boshlanadi.

7.  Xarita/labirint seed bo'yicha yaratiladi.

8.  Teamlar spawn pointlarga joylashtiriladi.

9.  Task e'lon qilinadi.

10. Match active holatga o'tadi.

11. Playerlar harakatlanadi.

12. Playerlar jang qiladi.

13. Health, damage va death hisoblanadi.

14. Task sharti tekshirib boriladi.

15. G'alaba sharti bajarilsa match tugaydi.

16. Winner aniqlanadi.

17. XP va statistika hisoblanadi.

18. Natijalar databasega yoziladi.

19. Playerlar result screenga o'tadi.

## 10. Team tizimi

O'yinda jamoalar 1 kishidan 4 kishigacha bo'lishi mumkin.

Team qoidalari:

-   player solo o'ynashi mumkin;

-   player do'stlarini teamga chaqirishi mumkin;

-   player auto team orqali tasodifiy jamoaga qo'shilishi mumkin;

-   agar player team topa olmasa, solo qolishi mumkin;

-   bitta teamda 1--4 ta player bo'ladi;

-   MVP da bitta team ichida bir xil role takrorlanishi mumkin.

Masalan, bitta teamda 4 ta Healer yoki 4 ta Warrior bo'lishi mumkin.
Keyingi versiyalarda balans uchun role cheklovi qo'shilishi mumkin.

## 11. Role tizimi

MVP versiyada 4 ta role bo'ladi:

### 1. Warrior

Warrior yaqin masofada jang qiladigan kuchli hujumchi.

Xususiyatlari:

-   yaqin masofada kuchli;

-   HP o'rtacha/yaxshi;

-   damage yuqori;

-   speed o'rtacha.

Skill:

-   sword attack;

-   dash.

Statistika:

HP: 120\
Damage: 25\
Range: yaqin

### 2. Archer

Archer uzoq masofadan hujum qiladigan role.

Xususiyatlari:

-   uzoq masofadan hujum qiladi;

-   HP pastroq;

-   damage o'rtacha;

-   range yuqori.

Skill:

-   arrow attack;

-   long shot.

Statistika:

HP: 90\
Damage: 20\
Range: uzoq

### 3. Healer

Healer jamoani davolashga mo'ljallangan yordamchi role.

Xususiyatlari:

-   jamoani davolaydi;

-   damage past;

-   HP o'rtacha;

-   jamoada juda foydali.

Skill:

-   weak attack;

-   heal.

Statistika:

HP: 100\
Damage: 10\
Heal: 20

### 4. Sehrgar

Sehrgar masofadan skill orqali hujum qiladigan role.

Xususiyatlari:

-   masofadan hujum qiladi;

-   HP pastroq;

-   area damage bera oladi;

-   fireball ishlatadi.

Skill:

-   fireball;

-   area blast.

Statistika:

HP: 80\
Damage: 30\
Range: o'rta/uzoq\
Skill: fireball

## 12. Map / Labyrinth tizimi

MVP versiyada bitta asosiy labirint xarita bo'ladi.

Map qoidalari:

-   labirint xaritada 12 ta spawn point bo'ladi;

-   har bir team match boshida bitta spawn pointga joylashtiriladi;

-   spawn pointlar bir-biridan nisbatan teng masofada bo'ladi;

-   agar teamlar soni kam bo'lsa, tizim bir-biridan uzoqroq spawn
    > pointlarni tanlaydi;

-   har bir matchda labirint seed asosida yaratiladi;

-   bir xil seed ishlatilsa, bir xil labirint hosil bo'ladi.

MVP uchun xarita 8--12 playerga mos bo'lishi kerak. Juda katta xarita
playerlarni uzoq vaqt uchrashtirmay qo'yishi mumkin, juda kichik xarita
esa matchni juda tez tugatib yuboradi.

## 13. Combat tizimi

Combat tizimi o'yindagi jang mexanikasini boshqaradi.

Asosiy qoidalar:

-   har bir playerda HP bo'ladi;

-   har bir role turlicha damage beradi;

-   player attack qilganda server masofa va yo'nalishni tekshiradi;

-   agar zarba to'g'ri tegsa, raqib HP kamayadi;

-   HP 0 bo'lsa, player o'ladi;

-   teamdagi hamma player o'lsa, team yutqazadi;

-   oxirida tirik qolgan team g'olib bo'ladi.

Server quyidagilarni tekshiradi:

-   player tirikmi;

-   attack cooldown tugaganmi;

-   raqib attack range ichidami;

-   zarba yo'nalishi to'g'rimi;

-   damage role statistikasiga mosmi.

Muhim qoida: frontend faqat harakat yoki attack signali yuboradi.
Haqiqiy damage, death va winner hisob-kitoblarini server bajaradi.

## 14. XP / LVL tizimi

XP tizimi ikki qismdan iborat bo'ladi:

### 1. Team reward

Bu g'olib jamoaga beriladigan umumiy mukofot.

G'olib team: 100 XP umumiy mukofot

Bu XP teamdagi playerlar soniga qarab taqsimlanadi.

Masalan:

1 kishilik team: 100 XP\
2 kishilik team: 50 XP dan\
4 kishilik team: 25 XP dan

### 2. Personal performance reward

Bu har bir playerning o'yindagi harakatiga qarab beriladi.

XP hisoblash namunasi:

Kill: +10 XP\
Assist: +5 XP\
Damage: +0.1 XP har 10 damage uchun\
Heal: +0.1 XP har 10 heal uchun\
Survival time: +1 XP har 60 soniya uchun\
Objective: +20 XP

XP natijasida player leveli oshadi.

Level tizimi umumiy XP asosida ishlaydi. Masalan, player matchlardan XP
yig'adi va belgilangan XP chegarasiga yetganda keyingi levelga o'tadi.

MVP uchun level tizimi oddiy bo'ladi:

Player XP yig'adi.\
XP ma'lum chegaraga yetsa, level oshadi.

## 15. Multiplayer / Socket tizimi

Multiplayer tizimi real-time o'yin holatini boshqaradi.

Socket orqali quyidagi hodisalar uzatiladi:

-   player lobbyga kirdi;

-   player team tanladi;

-   player role tanladi;

-   match countdown boshlandi;

-   match boshlandi;

-   player harakatlandi;

-   player attack qildi;

-   player damage oldi;

-   player o'ldi;

-   team yutqazdi;

-   match tugadi;

-   winner aniqlandi.

Muhim qoida:

Frontend signal yuboradi.\
Server tekshiradi va hisoblaydi.\
Server natijani barcha playerlarga yuboradi.

Masalan:

Player attack qildi.\
Server masofani tekshiradi.\
Server damage hisoblaydi.\
Server HP ni kamaytiradi.\
Agar HP 0 bo'lsa, player dead holatiga o'tadi.\
Natija barcha playerlarga yuboriladi.

## 16. Database vazifasi

Database real-time harakatlarni saqlash uchun ishlatilmaydi.

Database quyidagi doimiy ma'lumotlarni saqlaydi:

-   user ma'lumotlari;

-   player level va XP;

-   role sozlamalari;

-   match tarixi;

-   match natijalari;

-   player statistikasi;

-   map ma'lumotlari;

-   task ma'lumotlari.

Real-time holatlar esa match davomida server xotirasida saqlanadi.

Masalan, databasega yozilmaydi:

player har bir qadam tashlagani;\
har soniyadagi pozitsiya;\
har bir kamera burilishi;\
har bir kichik harakat.

Databasega yoziladi:

match qachon boshlandi;\
match qachon tugadi;\
kim yutdi;\
kim nechta kill qildi;\
kim qancha XP oldi;\
kim qaysi role bilan o'ynadi.

## 17. MVP uchun minimal database modellar

Keyingi bosqichda quyidagi asosiy modellar kerak bo'ladi:

users\
player_stats\
roles\
maps\
tasks\
matches\
teams\
match_players

MVP uchun shular yetarli bo'ladi.

Keyingi versiyalarda qo'shilishi mumkin:

skins\
items\
inventory\
weapons\
abilities\
territories\
alliances\
friends\
rankings\
seasons\
battle_pass\
chat_messages\
reports

## 18. API va Socket eventlar

MVP da API va Socket alohida ishlatiladi.

### API vazifasi

API oddiy ma'lumotlar uchun ishlatiladi:

register\
login\
profile\
role list\
player stats\
match history\
leaderboard

### Socket vazifasi

Socket real-time o'yin uchun ishlatiladi:

join_lobby\
select_team\
select_role\
start_countdown\
match_started\
player_move\
player_attack\
player_damaged\
player_dead\
team_eliminated\
match_ended

Oddiy qilib:

API = profil, login, statistika, tarix\
Socket = jonli o'yin harakati

## 19. Keyingi versiyalar roadmap

### MVP

-   8--12 player;

-   1--4 kishilik team;

-   4 role;

-   1 labirint xarita;

-   Survival task;

-   XP/stat save;

-   oddiy result screen.

### V1.1

-   hudud egallash rejimi;

-   territory ownership;

-   oddiy minimap;

-   team chat;

-   role balance yaxshilash.

### V2

-   ittifoq tizimi;

-   yangi tasklar;

-   mobs;

-   boss;

-   yangi labirint turlari;

-   yangi rollar.

### V3

-   ranking;

-   seasons;

-   skins;

-   battle pass;

-   friends system;

-   custom rooms;

-   tournament mode.

## 20. MVP bo'yicha yakuniy xulosa

**Maze Champions MVP** ning asosiy vazifasi --- kichik, lekin
ishlaydigan multiplayer labirint jang o'yinini yaratish.

MVP da asosiy e'tibor quyidagilarga qaratiladi:

\- player o'yinga kira olishi;\
- lobby ishlashi;\
- team tanlash ishlashi;\
- role tanlash ishlashi;\
- match boshlanishi;\
- playerlar bir-birini real-time ko'rishi;\
- attack va damage ishlashi;\
- death va winner aniqlanishi;\
- XP va statistika saqlanishi.

Shu MVP to'g'ri ishlasa, keyingi bosqichlarda hudud egallash, ittifoq,
mobs, boss, ranking va skinlar qo'shish osonroq bo'ladi.

TZ ichiga albatta alohida bo'lim qilib qo'shish kerak. Mana tayyor
varianti:

# Texnologiyalar va texnik stack

## Frontend

O'yinning frontend qismi web asosida ishlab chiqiladi.

Asosiy texnologiyalar:

Next.js\
React\
React Three Fiber\
Three.js\
TailwindCSS\
Socket.io-client

Frontend vazifalari:

\- asosiy menyu interfeysini ko'rsatish\
- login yoki guest kirish oynasini ko'rsatish\
- lobby yaratish va lobby code ko'rsatish\
- code orqali matchga qo'shilish oynasini yaratish\
- team tanlash interfeysini ko'rsatish\
- role tanlash interfeysini ko'rsatish\
- countdown holatini real-time ko'rsatish\
- 3D labirint sahnasini chizish\
- player modelini ko'rsatish\
- boshqa playerlarni real-time ko'rsatish\
- HP, skill, task va match holatini HUD orqali chiqarish\
- result screen ko'rsatish

## Backend

Backend o'yinning asosiy server logikasini boshqaradi.

Asosiy texnologiyalar:

Node.js\
Express.js\
Socket.io

Backend vazifalari:

\- user/guest yaratish\
- login/register qilish\
- lobby yaratish\
- lobby code generatsiya qilish\
- code orqali matchga qo'shish\
- team yaratish va teamga qo'shish\
- role tanlash\
- ready holatini boshqarish\
- countdownni boshqarish\
- match start qilish\
- real-time game state saqlash\
- movement validation\
- attack/damage/heal hisoblash\
- death va team elimination aniqlash\
- winner aniqlash\
- XP va level hisoblash\
- match natijalarini databasega yozish

Muhim qoida:

Frontend faqat signal yuboradi.\
Haqiqiy game logic backendda hisoblanadi.

Masalan, player attack qilsa, frontend faqat player_attack event
yuboradi. Damage, HP kamayishi, death va winner hisob-kitobini backend
bajaradi.

## Real-time aloqa

Real-time multiplayer uchun:

Socket.io

Socket.io orqali quyidagi hodisalar uzatiladi:

join_lobby_room\
lobby_updated\
select_team\
select_role\
set_ready\
countdown_started\
countdown_tick\
countdown_cancelled\
match_started\
player_move\
player_moved\
player_attack\
attack_result\
player_damaged\
player_dead\
team_eliminated\
match_ended

## Database

Doimiy ma'lumotlarni saqlash uchun:

PostgreSQL

ORM sifatida quyidagilardan biri tanlanadi:

Prisma ORM

Agar backend Node.js bo'lsa, Prisma yaxshi variant. Lekin bu hali
majburiy emas. Agar keyin boshqa backend tanlansa, database modeli
boshqa ORMga o'tkaziladi.

Database saqlaydigan ma'lumotlar:

\- users\
- player_stats\
- roles\
- maps\
- map_spawn_points\
- tasks\
- matches\
- teams\
- match_players

Database saqlamaydigan ma'lumotlar:

\- playerning har bir qadami\
- har soniyadagi position\
- kamera aylanishi\
- real-time attack holatlari\
- temporary match state

Real-time match holati backend server memory ichida saqlanadi.

## 3D va vizual uslub

O'yin Minecraft/blocky uslubida bo'ladi.

Buning sabablari:

\- personajlarni yasash osonroq\
- animatsiya qilish yengilroq\
- asset ishlab chiqish tezroq\
- MVP uchun grafik xarajat kamayadi\
- browserda ishlatish nisbatan yengil bo'ladi

3D sahna uchun:

Three.js\
React Three Fiber

MVP grafikasi oddiy bo'ladi:

\- blocky player model\
- oddiy labirint devorlari\
- oddiy ground\
- role ranglari yoki belgilar\
- HP bar\
- basic attack effect

## Autentifikatsiya

MVP da ikki xil kirish bo'ladi:

Guest login\
Register/Login

Guest login tez test va tez o'ynash uchun kerak.

Register/Login esa doimiy XP, level va statistikani saqlash uchun kerak.

Token tizimi:

JWT token

## Hosting / deployment

MVP ni deploy qilish uchun taxminiy variant:

Frontend: Vercel yoki VPS\
Backend: VPS\
Database: PostgreSQL VPS yoki managed PostgreSQL

Agar hammasi bitta serverda bo'lsa:

Frontend\
Backend\
PostgreSQL

bitta VPSda ishga tushirilishi mumkin.

## Development va test muhiti

Test qilish uchun:

Chrome + Incognito\
yoki\
Chrome + Firefox

orqali ikki xil guest player sifatida kirib match test qilinadi.

MVP test qoidasi:

minimum players: 2\
minimum teams: 2\
maximum players: 12\
team size: 1--4

Dev mode uchun countdown qisqartirilishi mumkin:

production countdown: 60 sekund\
dev countdown: 10 sekund

## Yakuniy tanlangan stack

MVP uchun tavsiya qilinadigan yakuniy stack:

Frontend:\
Next.js + React + React Three Fiber + Three.js + TailwindCSS\
\
Backend:\
Node.js + Express.js + Socket.io\
\
Database:\
PostgreSQL\
\
ORM:\
Prisma ORM\
\
Auth:\
JWT\
\
Realtime:\
Socket.io\
\
3D:\
Three.js / React Three Fiber
