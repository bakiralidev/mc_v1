Maze Champions MVP — Gameplay Balance v0.1
1. O‘lchov birligi

O‘yinda bitta asosiy o‘lchov ishlatiladi:

1 game unit = 1 block

Ya’ni Minecraft uslubida tasavvur qilamiz:

1 block = 1 metrga yaqin masofa

Shunda xarita, yurish, attack range va skill radiuslarini hisoblash oson bo‘ladi.

2. Xarita o‘lchami

MVP uchun bitta map:

Map name: Classic Maze
Width: 100 unit
Height: 100 unit
Max players: 12
Spawn points: 12 ta
Labirint o‘lchamlari
Xarita o‘lchami: 100 x 100 unit
Devoring balandligi: 3 unit
Devoring qalinligi: 1 unit
Yo‘lak kengligi: 4 unit
Markaziy maydon: 14 x 14 unit
Spawn safe radius: 4 unit
Spawn protection

Match boshlanganda player birdan o‘lib qolmasligi uchun:

Spawn protection: 3 sekund

Bu vaqt ichida:

player damage olmaydi
player attack qila olmaydi
player harakatlana oladi
3. Player collider / hitbox

Har bir player uchun oddiy collider:

Player height: 1.8 unit
Player radius: 0.45 unit
Player width: 0.9 unit

MVP’da headshot yo‘q.

Head damage yo‘q
Body damage bitta umumiy hitbox orqali hisoblanadi

Keyingi versiyada headshot yoki armor zone qo‘shish mumkin, lekin MVP uchun kerak emas.

4. Umumiy movement qoidalari

MVP’da barcha playerlar WASD orqali yuradi.

W / Arrow Up    → oldinga
S / Arrow Down  → orqaga
A / Arrow Left  → chapga
D / Arrow Right → o‘ngga
Mouse           → nishon / camera yo‘nalishi
Umumiy movement
Acceleration: 20 unit/s²
Rotation speed: 720 degree/s
Jump: MVP’da yo‘q
Sprint: MVP’da yo‘q
Crouch: MVP’da yo‘q

MVP’da o‘yinni soddaroq qilish uchun jump, sprint, crouch qo‘shilmaydi.

5. Role movement speed

Har bir role tezligi alohida bo‘ladi.

Role	Speed	Izoh
Warrior	5.0 unit/s	Og‘ir armor, o‘rtacha tezlik
Archer	5.8 unit/s	Eng chaqqon role
Healer	5.3 unit/s	O‘rtacha tez
Mage	4.9 unit/s	Sekinroq, lekin kuchli skill

Bu yerda base_speed DB’dagi qiymatga bog‘lanishi mumkin:

realSpeed = 5.0 * base_speed

Lekin amalda backendda aniq qiymat ishlatish yaxshiroq.

6. Camera va nishon tizimi

MVP uchun eng yaxshi kamera:

Third-person camera
Camera distance: 6 unit
Camera height: 3.2 unit
Camera angle: biroz yuqoridan
Nishon olish

Ekran markazida oddiy crosshair bo‘ladi.

Player attack qilganda frontend serverga yuboradi:

player position
player rotation
attack direction
target id, agar mavjud bo‘lsa

Server tekshiradi:

target range ichidami?
target devor orqasidami?
target dushmanmi?
player tirikmi?
cooldown tugaganmi?

MVP’da devor orqasidan urish mumkin emas.

Line of sight shart

Ya’ni Archer, Mage yoki Healer devor orqasidagi playerga attack/heal qila olmaydi.

7. Umumiy combat qoidalari
Friendly fire: yo‘q
Respawn: yo‘q
Auto HP regen: yo‘q
Ammo/inventory: yo‘q
Headshot: yo‘q
Critical hit: yo‘q

MVP’da hamma damage va heal serverda hisoblanadi.

Frontend faqat signal yuboradi:

men attack qildim
men skill ishlatdim
men heal qildim

Backend esa haqiqiy natijani hisoblaydi.

8. Rolelar umumiy balansi
Role	HP	Damage	Speed	Attack range	Vazifasi
Warrior	120	25	5.0	2.2	Yaqin jang, old chiziq
Archer	90	20	5.8	18	Uzoq masofa, tez harakat
Healer	100	10	5.3	7	Jamoani davolash
Mage	80	30	4.9	12	Magic damage, area skill
9. Warrior gameplay logic
Role vazifasi

Warrior — yaqin masofada kuchli jangchi. U dushmanga yaqinlashib qilichsiz “melee hit” yoki qo‘l/jang animatsiyasi orqali damage beradi.

Siz qilich modelini keyin qo‘shishingiz mumkin, lekin MVP’da weapon model shart emas.

Warrior statlari
HP: 120
Speed: 5.0 unit/s
Main damage: 25
Main attack range: 2.2 unit
Main attack angle: 90 degree cone
Main attack cooldown: 0.9 sekund
Attack windup: 0.18 sekund
Warrior main attack

Warrior yaqin masofadan uradi.

Server tekshiradi:

target 2.2 unit ichidami?
target Warrior oldida 90 degree cone ichidami?
target dushman teamdanmi?
cooldown tugaganmi?

Agar to‘g‘ri bo‘lsa:

target HP -25
Warrior skill: Dash
Skill name: Dash
Cooldown: 5 sekund
Dash distance: 6 unit
Dash duration: 0.25 sekund
Damage: 0

Dash damage bermaydi, faqat tez yaqinlashish yoki qochish uchun.

Qoidalar:

devor ichidan o‘tmaydi
map tashqarisiga chiqmaydi
cooldown bo‘lsa ishlamaydi
dead player dash qila olmaydi
Warrior gameplay uslubi
Yaqinlashadi
Dash bilan masofani qisqartiradi
Yaqin attack qiladi
Ko‘p HP sababli oldingi chiziqda turadi
10. Archer gameplay logic
Role vazifasi

Archer uzoq masofadan o‘q otadi. U tez yuradi, lekin HP pastroq.

Archer statlari
HP: 90
Speed: 5.8 unit/s
Main damage: 20
Main attack range: 18 unit
Arrow speed: 30 unit/s
Arrow hit radius: 0.18 unit
Main attack cooldown: 1.1 sekund
Draw time: 0.35 sekund
Archer main attack: Arrow Shot

Archer o‘q uzadi. O‘q projectile bo‘lib uchadi.

Qoidalar:

o‘q to‘g‘ri yo‘nalishda uchadi
devorga tegsa yo‘qoladi
birinchi dushmanga tegsa damage beradi
teamdoshga damage bermaydi

Damage:

target HP -20
Archer qayta o‘q uzish

MVP’da alohida ammo yo‘q. Ya’ni o‘qi tugamaydi.

Lekin qayta o‘q uzish uchun cooldown bor:

Har 1.1 sekundda bitta o‘q uzishi mumkin

Agar user spam qilsa:

server attackni rad qiladi
Archer skill: Long Shot
Skill name: Long Shot
Cooldown: 6 sekund
Range: 28 unit
Arrow speed: 38 unit/s
Damage: 32
Draw time: 0.55 sekund
Hit radius: 0.16 unit

Long Shot bitta targetga kuchliroq damage beradi.

Qoidalar:

devordan o‘tmaydi
faqat bitta targetga tegadi
teamdoshga damage bermaydi
Archer gameplay uslubi
Uzoqdan uradi
Tez harakat qiladi
Warriordan uzoqroq yuradi
HP kam bo‘lgani uchun yaqin jangdan qochadi
11. Healer gameplay logic
Role vazifasi

Healer jamoani tirik saqlaydi. Uning damage’i past, lekin heal juda foydali.

Healer statlari
HP: 100
Speed: 5.3 unit/s
Main damage: 10
Main attack range: 7 unit
Main attack cooldown: 1.0 sekund
Heal amount: 25
Heal range: 8 unit
Heal cooldown: 8 sekund
Heal cast time: 0.4 sekund
Healer main attack: Weak Magic Hit

Healer kichik magic zarba beradi.

Range: 7 unit
Damage: 10
Cooldown: 1 sekund

Bu attack kuchsiz, lekin o‘zini himoya qilish uchun kerak.

Healer skill: Heal

Healer o‘z teamidagi playerni davolaydi.

Qoidalar:

faqat teamdoshni heal qiladi
dushmanni heal qila olmaydi
dead playerni heal qila olmaydi
target 8 unit ichida bo‘lishi kerak
target devor orqasida bo‘lmasligi kerak
HP max HPdan oshmaydi

Heal formula:

newHp = min(currentHp + 25, maxHp)

Agar Warrior HP 110 bo‘lsa:

110 + 25 = 135
max HP = 120
final HP = 120
real healing = 10

healing_done ga faqat haqiqiy tiklangan HP yoziladi.

Healer gameplay uslubi
Orqa yoki o‘rta chiziqda yuradi
Warrior va Archerlarni heal qiladi
O‘zi kuchsiz damage beradi
Team uchun eng muhim support role
12. Mage gameplay logic
Role vazifasi

Mage kuchli magic damage beradi. HP eng past, lekin area damage bor.

Mage statlari
HP: 80
Speed: 4.9 unit/s
Main damage: 30
Main attack range: 12 unit
Fireball speed: 18 unit/s
Fireball radius: 0.35 unit
Main attack cooldown: 1.4 sekund
Cast time: 0.35 sekund
Mage main attack: Fireball

Mage fireball otadi.

Qoidalar:

projectile ko‘rinishida uchadi
devorga tegsa portlaydi yoki yo‘qoladi
targetga tegsa 30 damage beradi
teamdoshga damage bermaydi

MVP uchun fireball splash bermasa ham bo‘ladi. Splash faqat skillda bo‘ladi.

Damage:

target HP -30
Mage skill: Area Blast
Skill name: Area Blast
Cooldown: 10 sekund
Radius: 5 unit
Damage: 22
Cast time: 0.6 sekund

Mage o‘z atrofida yoki nishonlangan nuqta atrofida portlash qiladi.

MVP uchun eng oson variant:

Mage o‘z atrofida 5 unit radiusda damage beradi

Qoidalar:

faqat dushmanlarga damage beradi
teamdoshga damage bermaydi
devor orqasidagi dushman damage olmasin
cooldown tugagan bo‘lishi kerak
Mage gameplay uslubi
Masofadan kuchli uradi
HP past
O‘zi yolg‘iz qolsa xavfli
Team orqasidan damage berishi kerak
Area Blast bilan bir nechta dushmanga zarar beradi
13. Rolelar bo‘yicha cooldown jadvali
Role	Main attack cooldown	Skill	Skill cooldown
Warrior	0.9s	Dash	5s
Archer	1.1s	Long Shot	6s
Healer	1.0s	Heal	8s
Mage	1.4s	Area Blast	10s
14. Rolelar bo‘yicha range jadvali
Role	Main range	Skill range / radius
Warrior	2.2	Dash 6
Archer	18	Long Shot 28
Healer	7	Heal 8
Mage	12	Area Blast radius 5
15. Damage / heal jadvali
Role	Main damage	Skill damage / heal
Warrior	25	Dash damage yo‘q
Archer	20	Long Shot 32
Healer	10	Heal +25 HP
Mage	30	Area Blast 22 damage
16. Attack turlari
Melee attack

Warrior uchun.

Range: qisqa
Yo‘nalish: cone
Projectile yo‘q
Server targetni yaqin masofa va burchak orqali topadi
Projectile attack

Archer va Mage uchun.

O‘q/fireball uchadi
Devorga tegsa to‘xtaydi
Targetga tegsa damage beradi
Server projectile collision tekshiradi
Targeted heal

Healer uchun.

Faqat teamdosh
Range ichida
Line of sight bor
HP tiklaydi
Area skill

Mage uchun.

Radius ichidagi dushmanlar
Friendly fire yo‘q
Devor orqasida bo‘lsa damage olmaydi
17. Line of sight qoidasi

Line of sight degani: player va target orasida devor bo‘lmasligi kerak.

Quyidagilar uchun line of sight kerak:

Archer arrow
Archer long shot
Mage fireball
Mage area blast
Healer heal

Warrior melee ham devor orqasidan ura olmaydi.

18. Skill ishlatish qoidalari

Har skill ishlashidan oldin server tekshiradi:

match ACTIVE holatidami?
player ALIVE holatidami?
role to‘g‘rimi?
skill cooldown tugaganmi?
target validmi?
range validmi?
line of sight bormi?

Agar bittasi noto‘g‘ri bo‘lsa:

skill ishlamaydi
frontendga error yoki reject event qaytadi
19. Match davomiyligi

MVP uchun match juda uzoq cho‘zilmasligi kerak.

Target match duration: 3–6 minut
Max match duration: 8 minut

Agar 8 minutda match tugamasa, sudden death boshlanishi mumkin.

MVP sudden death

Soddaroq variant:

8 minutdan keyin barcha tirik playerlar har 10 sekundda 5 damage oladi

Bu matchni majburan tugatadi.

Agar hozircha murakkab bo‘lsa, sudden deathni keyingi versiyaga qoldirish mumkin.

20. XP uchun gameplay bilan bog‘liq qiymatlar
Kill: +10 XP
Assist: +5 XP
Damage: har 100 damage uchun +1 XP
Heal: har 100 healing uchun +1 XP
Survival: har 60 sekund uchun +1 XP
Winner objective: +20 XP
Team reward: winner teamga 100 XP bo‘linadi

Damage va heal XP ni juda ko‘p qilib yubormaslik kerak. Shuning uchun:

har 10 damage uchun 0.1 XP

o‘rniga amalda:

har 100 damage uchun 1 XP

qilib hisoblash osonroq.

21. Server tick va socket update

MVP uchun:

Server game tick: 20 tick/sec
Movement update receive: 10–20 marta/sec
Broadcast movement: 10 marta/sec
Combat event: darhol yuboriladi

Movement har safar DBga yozilmaydi.

DBga faqat match tugagandan keyin result yoziladi.

22. Frontend HUD qiymatlari

Match ichida ko‘rinishi kerak:

HP bar
Role name
Main attack cooldown
Skill cooldown
Kills
Alive teams count
Task: Last Team Alive

Archer uchun:

Arrow ready / cooldown
Long Shot cooldown

Healer uchun:

Heal cooldown
Target HP

Mage uchun:

Fireball cooldown
Area Blast cooldown

Warrior uchun:

Dash cooldown
23. Backend uchun config ko‘rinishi

Bularni serverda bitta config faylda saqlang.

Masalan:

export const GAME_BALANCE = {
  map: {
    width: 100,
    height: 100,
    wallHeight: 3,
    wallThickness: 1,
    corridorWidth: 4,
    spawnProtectionSeconds: 3,
    maxMatchDurationSeconds: 480,
  },

  player: {
    colliderRadius: 0.45,
    colliderHeight: 1.8,
    mainAttackGlobalCooldownMs: 300,
  },

  roles: {
    warrior: {
      hp: 120,
      speed: 5.0,
      mainAttack: {
        type: "melee",
        damage: 25,
        range: 2.2,
        angle: 90,
        cooldownMs: 900,
        windupMs: 180,
      },
      skill: {
        key: "dash",
        distance: 6,
        durationMs: 250,
        cooldownMs: 5000,
        damage: 0,
      },
    },

    archer: {
      hp: 90,
      speed: 5.8,
      mainAttack: {
        type: "projectile",
        damage: 20,
        range: 18,
        projectileSpeed: 30,
        projectileRadius: 0.18,
        cooldownMs: 1100,
        drawMs: 350,
      },
      skill: {
        key: "long_shot",
        damage: 32,
        range: 28,
        projectileSpeed: 38,
        projectileRadius: 0.16,
        cooldownMs: 6000,
        drawMs: 550,
      },
    },

    healer: {
      hp: 100,
      speed: 5.3,
      mainAttack: {
        type: "projectile",
        damage: 10,
        range: 7,
        projectileSpeed: 20,
        projectileRadius: 0.2,
        cooldownMs: 1000,
      },
      skill: {
        key: "heal",
        healAmount: 25,
        range: 8,
        cooldownMs: 8000,
        castMs: 400,
      },
    },

    mage: {
      hp: 80,
      speed: 4.9,
      mainAttack: {
        type: "projectile",
        damage: 30,
        range: 12,
        projectileSpeed: 18,
        projectileRadius: 0.35,
        cooldownMs: 1400,
        castMs: 350,
      },
      skill: {
        key: "area_blast",
        damage: 22,
        radius: 5,
        cooldownMs: 10000,
        castMs: 600,
      },
    },
  },
};
24. Yakuniy tavsiya

MVP uchun shu balans bilan boshlang:

Warrior — ko‘p HP, yaqin jang
Archer — tez, uzoq masofa
Healer — jamoani tirik saqlaydi
Mage — kuchli damage, HP past

Eng muhim narsa: bu qiymatlar birinchi balans versiyasi.

Testdan keyin albatta o‘zgartiriladi:

Agar Warrior juda kuchli bo‘lsa → damage 25 dan 22 ga tushiriladi
Agar Archer juda kuchli bo‘lsa → cooldown 1.1s dan 1.3s qilinadi
Agar Healer juda kuchli bo‘lsa → heal 25 dan 20 ga tushiriladi
Agar Mage juda kuchli bo‘lsa → fireball damage 30 dan 26 ga tushiriladi

Hozir esa backend/frontendni yozish uchun aniq gameplay o‘lchamlar va role actionlar tayyor bo‘ldi.