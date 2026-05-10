TASK: Maze Champions MVP Frontendni Full Ishlab Chiqish

Sen Maze Champions nomli browser-based multiplayer voxel/blocky game frontendini to‘liq MVP holatga keltirasan.

Bu o‘yin Minecraft/blocky uslubiga yaqin, lekin original dizaynga ega bo‘lishi kerak. Dizayn uchun reference sifatida berilgan rasmga maksimal darajada yaqinlash: katta MAZE CHAMPIONS logo, dark fantasy maze background, markazda PLAY / JOIN BY CODE / PROFILE / SETTINGS, o‘ngda MVP Mode panel, tepada user card, pastda role cards.

Agar rasm bilan bir xil 3D assetlar bo‘lmasa, CSS, gradient, blocky cardlar, glow effectlar, placeholder voxel character cardlar orqali shu atmosferaga maksimal yaqin qil. UI oddiy website yoki admin panelga o‘xshamasin — haqiqiy game launcher va MVP game frontend ko‘rinishida bo‘lsin.

1. Texnologiya talablari

Frontend quyidagi stackda ishlab chiqilsin:

Next.js
React
TypeScript
TailwindCSS
Socket.io-client
React Three Fiber / Three.js

Qo‘shimcha ishlatish mumkin:

Zustand yoki Context API — global state uchun
Framer Motion — animatsiyalar uchun
Lucide React yoki custom icons — iconlar uchun

Lekin loyiha ortiqcha og‘irlashib ketmasin. Kod toza, komponentlarga bo‘lingan va productionga yaqin bo‘lsin.

2. Umumiy MVP flow

Frontend quyidagi to‘liq flow’ni qoplashi kerak:

User o‘yinga kiradi
→ Agar token bo‘lmasa Guest sifatida kiradi yoki login/register qiladi
→ Home page ko‘radi
→ Play bosib lobby yaratadi
→ Lobby code oladi
→ Boshqa user Join by Code orqali shu lobbyga kiradi
→ User team tanlaydi yoki solo qoladi
→ Role tanlaydi
→ Ready bosadi
→ Kamida 2 player va 2 team bo‘lsa countdown boshlanadi
→ Match start bo‘ladi
→ Playerlar 3D labirint sahnada ko‘rinadi
→ Player movement real-time sync bo‘ladi
→ Attack / skill / heal ishlaydi
→ HP kamayadi, death holati chiqadi
→ Team eliminated bo‘ladi
→ Winner aniqlanadi
→ Result screen chiqadi
→ XP va stats ko‘rsatiladi

Frontend MVP shu flow boshidan oxirigacha ishlaydigan bo‘lishi kerak.

3. Page / Route strukturasi

Quyidagi sahifalar bo‘lsin:

/                  → Home / Main menu
/lobby/[matchId]   → Lobby screen
/match/[matchId]   → Game scene
/result/[matchId]  → Result screen

Agar route strukturasi boshqacha bo‘lsa ham mayli, lekin flow aniq bo‘lishi kerak.

4. API integration

Frontend backend bilan ishlashi kerak.

API base URL .env dan olinsin:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

API client alohida faylda bo‘lsin:

src/lib/api.ts

Token localStorage’da saqlansin:

maze_token
maze_user

Har bir protected requestda header yuborilsin:

Authorization: Bearer <token>

Kerakli APIlar:

POST /api/auth/guest
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/profile/me
GET  /api/profile/stats

GET  /api/game/meta

POST /api/matches/create-lobby
POST /api/matches/join-by-code

GET  /api/matches/:matchId
GET  /api/matches/:matchId/result

Agar ayrim endpointlar hali backendda tayyor bo‘lmasa, UI buzilmasin. Error handling chiqsin. Lekin endpoint tayyor bo‘lsa, real API bilan ishlasin.

Muhim: frontend hech qachon password_hash ko‘rsatmasin va ishlatmasin.

5. Global state

Quyidagi state’lar boshqarilishi kerak:

auth user
token
profile
stats
game meta
current match
current lobby
selected team
selected role
ready status
socket connection
game state
player HP
match result

State management uchun Zustand yoki Context ishlatilsin.

Tavsiya qilingan fayllar:

src/store/authStore.ts
src/store/gameStore.ts
src/store/socketStore.ts
6. Home page dizayni

Home page reference rasmga maksimal yaqin bo‘lsin.

Layout
Top center:
- MAZE CHAMPIONS logo
- Battle. Survive. Conquer the Maze.

Center:
- PLAY
- JOIN BY CODE
- PROFILE / STATS
- SETTINGS

Top right:
- User card
- Avatar
- Username
- Level
- XP progress

Right:
- MVP MODE panel

Bottom left:
- Latest Update panel

Bottom center:
- Warrior / Archer / Healer / Mage role cards

Bottom:
- News / Leaderboard / Help / Exit footer
Visual style
dark fantasy maze background
blocky / voxel style
stone panels
gold Play button
blue metallic secondary buttons
purple neon MVP panel
green latest update panel
role colored cards
glow effects
torch/fire/magic atmosphere

Reference rasmga yaqinlashish uchun:

- background full-screen cinematic bo‘lsin
- logo katta va game-style bo‘lsin
- buttonlar bevel/stone/metal effekt bilan bo‘lsin
- role cardlar rangli, blocky, iconli bo‘lsin
- panellar border, shadow, glow bilan bo‘lsin

Agar real voxel background asset bo‘lmasa, CSS gradient va decorative elements bilan vaqtincha yaratiladi. Keyin image asset qo‘shish oson bo‘ladigan qilib yozilsin.

7. Home page funksiyalari
PLAY

Agar token bo‘lmasa:

POST /api/auth/guest

chaqirilsin va token saqlansin.

Keyin:

POST /api/matches/create-lobby

chaqirilsin.

Success bo‘lsa:

/lobby/[matchId]

sahifasiga o‘tsin.

Agar response’da lobby code bo‘lsa, lobbyda ko‘rsatiladi.

JOIN BY CODE

Modal ochilsin.

Modal ichida:

Lobby code input
Join button
Cancel button

User kod kiritadi.

Request:

POST /api/matches/join-by-code

Success bo‘lsa:

/lobby/[matchId]

ga o‘tsin.

Xatolar ko‘rsatilsin:

Code noto‘g‘ri
Lobby topilmadi
Match allaqachon boshlangan
Lobby to‘lgan
PROFILE / STATS

Modal ochilsin.

Requestlar:

GET /api/profile/me
GET /api/profile/stats

Ko‘rsatiladigan ma’lumotlar:

username
is_guest
level
xp
total_matches
wins
losses
kills
deaths
assists
damage_dealt
healing_done
SETTINGS

Modal ochilsin.

Hozircha local settings yetadi:

Sound: On / Off
Graphics: Low / Medium / High
Language: English / Uzbek

localStorage’da saqlansin.

8. Game meta integration

Home page ochilganda:

GET /api/game/meta

chaqirilsin.

Undan keladigan:

roles
maps
tasks
spawn_points

frontendda ishlatilsin.

Role cardlar backenddan kelgan role data asosida render qilinsin.

Agar API ishlamasa, fallback static role data chiqsin, lekin console’da error bo‘lsin.

9. Lobby page

/lobby/[matchId] sahifasi professional game lobby ko‘rinishida bo‘lsin.

Lobbyda ko‘rinadigan narsalar
Lobby code
Copy code button
Match mode: Survival
Task: Last Team Alive
Players count
Teams count
Minimum start condition
Team cards
Player list
Role selection
Ready button
Countdown
Leave lobby button
Lobby code

Katta, aniq ko‘rinsin:

AB12CD

Button:

Copy Code
10. Socket integration — lobby

Socket.io-client ulanadi.

Socket connection alohida service bo‘lsin:

src/lib/socket.ts

Kerakli socket eventlar:

connect
disconnect
join_lobby_room
leave_lobby_room
lobby_updated
create_team
join_team
select_role
set_ready
countdown_started
countdown_tick
countdown_cancelled
match_started

Lobby page ochilganda:

join_lobby_room

event yuborilsin.

Lobby update bo‘lsa UI real-time yangilansin.

2 ta browserda test qilinganda Player 1 va Player 2 bir-birini lobbyda ko‘rishi kerak.

11. Team selection UI

Lobby ichida user quyidagilarni qila olsin:

Solo qolish
Yangi team yaratish
Mavjud teamga qo‘shilish
Teamdan chiqish

Team cardda:

Team name
Team color
Player count 1/4
Players list
Join button

Qoidalar:

Team max 4 player
Bitta user faqat bitta teamda bo‘ladi
Match boshlansa team o‘zgartirib bo‘lmaydi
12. Role selection UI

Role tanlash qismi bo‘lsin.

Rolelar:

Warrior
Archer
Healer
Mage

Har bir cardda:

name
description
HP
Damage
Speed
Range
Skill

User role tanlasa:

select_role

event/API yuborilsin.

Tanlangan role active ko‘rinsin.

MVP da bitta teamda bir xil role takrorlanishi mumkin.

13. Ready va countdown UI

User team va role tanlagandan keyin Ready bosadi.

Ready bosishdan oldin tekshirish:

team tanlanganmi
role tanlanganmi

Agar tanlanmagan bo‘lsa, error chiqsin:

Avval team tanlang
Avval role tanlang

Ready bo‘lganda player row’da:

Ready

ko‘rinsin.

Start shartlari bajarilsa countdown ko‘rinsin:

Match starts in 60...

Countdown real-time yangilansin.

Countdown cancel bo‘lsa:

Countdown cancelled
Waiting for players...
14. Match start redirect

Socket orqali:

match_started

kelganda user:

/match/[matchId]

sahifasiga o‘tsin.

Match start data ichida bo‘lishi kerak:

map data
spawn points
players
teams
role stats
task
own player id
own team id
spawn position

Agar data yetarli bo‘lmasa, match page API orqali match state olib kelishga harakat qilsin.

15. Match / Game scene

/match/[matchId] sahifasi 3D MVP game scene bo‘lishi kerak.

MVP grafikasi juda murakkab bo‘lishi shart emas, lekin playable bo‘lsin.

3D scene elementlari
ground
maze walls
spawn points
own player
other players
simple role colors
camera
lights
sky/dark background

React Three Fiber / Three.js ishlatilsin.

Agar to‘liq maze generation hali yo‘q bo‘lsa, Classic Maze uchun static grid/walls yaratiladi.

Style blocky bo‘lsin:

cube player
cube walls
stone material
dark maze atmosphere
16. Player rendering

Own player va other players ko‘rinsin.

Har player ustida:

username
HP bar
team color

Rolega qarab rang:

Warrior red/orange
Archer green
Healer blue
Mage purple

Own player ajralib tursin.

17. Movement frontend

Keyboard control:

WASD yoki Arrow keys
Mouse rotate yoki simple camera follow
Space optional

Player yurganda frontend serverga yuboradi:

player_move

Data:

position
rotation
velocity

Serverdan:

player_moved

kelganda boshqa playerlar pozitsiyasi yangilansin.

Frontendda basic collision bo‘lsin:

devordan o‘tib ketmasin
mapdan chiqib ketmasin

Agar server movement rad etsa, player oldingi valid positionga qaytsin.

18. Game HUD

Match ichida HUD bo‘lsin:

HP bar
Role name
Skill cooldown
Task: Last Team Alive
Alive teams count
Kills
Damage
Team info
Leave match button

UI reference design bilan bir xil dark/metal/game panel uslubida bo‘lsin.

19. Attack UI

Attack uchun:

Left click yoki J key → main attack
Q yoki E key → skill

Mobile/tablet uchun buttonlar ham bo‘lsin:

Attack
Skill
Heal / ability

Socket event:

player_attack

Serverdan keladigan eventlar:

attack_result
player_damaged
player_dead
team_eliminated
match_ended

Attack animatsiyasi oddiy bo‘lsa ham bo‘lsin:

sword slash effect
arrow line
fireball projectile placeholder
heal green glow
20. Role skill UI

MVP skilllar:

Warrior: sword_attack + dash
Archer: arrow_attack + long_shot
Healer: weak_attack + heal
Mage: fireball + area_blast

Skill cooldown ko‘rinsin.

Agar skill cooldown bo‘lsa, button disabled bo‘lsin.

Healer heal ishlatganda teamdoshi tanlanishi yoki eng yaqin teamdosh heal bo‘lishi mumkin. MVP uchun eng yaqin teamdosh heal qilinsa yetadi.

21. HP / Damage / Death UI

Serverdan player_damaged kelsa:

HP bar kamayadi
damage number effect chiqadi

Agar player_dead kelsa:

player dead animation yoki gray state
own player o‘lsa "You are dead" overlay
movement/attack disabled

MVP da respawn yo‘q.

22. Team eliminated / winner UI

Team eliminated bo‘lsa screen’da kichik notification chiqsin:

Team Blue eliminated

Match tugasa:

match_ended

event keladi va user:

/result/[matchId]

ga o‘tadi.

23. Result screen

/result/[matchId] professional game result screen bo‘lsin.

Ko‘rsatiladigan ma’lumotlar:

Victory / Defeat
Winner Team
Your Team
Selected Role
Kills
Deaths
Assists
Damage Dealt
Healing Done
Survived Time
Team XP
Performance XP
Total XP
Level Before
Level After

Buttonlar:

Play Again
Main Menu
Exit

Play Again bosilsa yangi lobby yaratish flow ishlasin.

Main Menu bosilsa / ga qaytsin.

24. Loading va error states

Har bir sahifada loading va error holat bo‘lsin.

Loading profile...
Loading lobby...
Connecting to server...
Reconnecting...
Lobby not found
Match already started
You are disconnected

Agar socket uzilib qolsa:

Connection lost. Trying to reconnect...

ko‘rsatilsin.

25. Responsive design

Desktopda reference rasmga maksimal yaqin cinematic layout bo‘lsin.

Tablet/mobile uchun:

Home page vertical stack
buttons full width
role cards horizontal scroll yoki 2-column grid
MVP panel pastga tushadi
Lobby cardlar responsive
Game HUD mobile-friendly

Mobileda gameplay murakkab bo‘lishi mumkin, lekin UI buzilmasin.

26. Component structure

Kod quyidagicha bo‘lingan bo‘lsin:

src/
  app/
    page.tsx
    lobby/[matchId]/page.tsx
    match/[matchId]/page.tsx
    result/[matchId]/page.tsx

  components/
    home/
      HomePage.tsx
      GameLogo.tsx
      MainMenuButtons.tsx
      UserCard.tsx
      MvpModePanel.tsx
      LatestUpdatePanel.tsx
      RolePreviewCards.tsx
      FooterNav.tsx

    lobby/
      LobbyPage.tsx
      LobbyCodePanel.tsx
      TeamList.tsx
      TeamCard.tsx
      RoleSelection.tsx
      ReadyPanel.tsx
      CountdownBanner.tsx

    game/
      GameScene.tsx
      PlayerModel.tsx
      MazeMap.tsx
      GameHUD.tsx
      SkillBar.tsx
      DamageEffect.tsx

    result/
      ResultPage.tsx
      ResultStats.tsx
      XpSummary.tsx

    modals/
      JoinCodeModal.tsx
      ProfileStatsModal.tsx
      SettingsModal.tsx

    ui/
      GameButton.tsx
      GamePanel.tsx
      GameModal.tsx
      ProgressBar.tsx

  lib/
    api.ts
    socket.ts
    auth.ts

  store/
    authStore.ts
    gameStore.ts
    socketStore.ts

  types/
    auth.ts
    game.ts
    match.ts

Agar mavjud struktura boshqacha bo‘lsa, shu mantiq bilan moslashtirilsin.

27. Dizayn sifat talablari

Frontend quyidagicha ko‘rinishi kerak:

oddiy website emas
admin panel emas
haqiqiy game UI
dark fantasy maze atmosphere
voxel/blocky identity
gold primary CTA
stone/metal panels
neon borders
role color identity
smooth animations
professional spacing
readable text

Reference rasmga yaqinlik bo‘yicha:

Home page layout 80–90% shu rasmga o‘xshasin
Agar assetlar bo‘lmasa ham composition bir xil bo‘lsin
Logo joylashuvi bir xil bo‘lsin
Button hierarchy bir xil bo‘lsin
Right MVP panel bir xil joylashsin
Bottom role cards bir xil joylashsin
Top-right user card bir xil joylashsin
28. Animations

Qo‘shiladigan animatsiyalar:

button hover glow
Play button pulse
panel fade-in
role card hover lift
modal scale/fade
XP bar animation
countdown pulse
damage number floating
skill cooldown radial/progress animation

Animations performancega zarar bermasin.

29. MVPga kirmaydigan frontend narsalar

Quyidagilarni hozir qilma:

skin shop
inventory
battle pass
friend list
friend request
leaderboard real data
territory mode
alliance system
boss/mobs
voice chat
advanced minimap
spectator mode
advanced anti-cheat UI

Lekin button yoki footer item placeholder bo‘lishi mumkin.

30. Acceptance criteria — Home page

Home page tayyor deb hisoblanadi, agar:

MAZE CHAMPIONS logo bor
subtitle bor
PLAY, JOIN BY CODE, PROFILE / STATS, SETTINGS bor
top-right user card bor
MVP Mode panel bor
Latest Update panel bor
4 ta role card bor
Footer nav bor
reference rasmga maksimal yaqin dark voxel game design bor
/api/game/meta dan role data olinadi
profile data ko‘rinadi
buttonlar modal/action ochadi
responsive buzilmaydi
31. Acceptance criteria — Lobby

Lobby tayyor deb hisoblanadi, agar:

lobby code ko‘rinadi
copy code ishlaydi
2 ta browser bilan bir lobbyga kirish mumkin
playerlar real-time ko‘rinadi
team yaratish ishlaydi
teamga qo‘shilish ishlaydi
solo qolish ishlaydi
role tanlash ishlaydi
ready ishlaydi
countdown ko‘rinadi
countdown cancel bo‘ladi
match_started kelganda match pagega o‘tadi
32. Acceptance criteria — Match scene

Match scene tayyor deb hisoblanadi, agar:

3D scene ochiladi
maze walls ko‘rinadi
own player ko‘rinadi
other players ko‘rinadi
WASD movement ishlaydi
movement boshqa browserda ko‘rinadi
HP bar ko‘rinadi
attack yuboriladi
damage eventda HP kamayadi
dead state ko‘rinadi
team eliminated notification chiqadi
match_ended bo‘lsa result pagega o‘tadi
33. Acceptance criteria — Result screen

Result screen tayyor deb hisoblanadi, agar:

Victory yoki Defeat ko‘rinadi
winner team ko‘rinadi
player stats ko‘rinadi
XP breakdown ko‘rinadi
level before/after ko‘rinadi
Play Again ishlaydi
Main Menu ishlaydi
34. Final full test scenario

Frontend tugaganini tekshirish uchun quyidagi test bajarilsin:

1. Chrome ochiladi
2. User Guest sifatida kiradi
3. Home page reference rasmga yaqin ko‘rinadi
4. PLAY bosiladi
5. Lobby yaratiladi
6. Lobby code chiqadi
7. Incognito ochiladi
8. Guest sifatida kiriladi
9. JOIN BY CODE bosiladi
10. Kod kiritiladi
11. Ikkala user bir lobbyda ko‘rinadi
12. Player 1 solo teamda qoladi
13. Player 2 alohida team yaratadi
14. Player 1 Warrior tanlaydi
15. Player 2 Archer tanlaydi
16. Ikkalasi Ready bosadi
17. Countdown boshlanadi
18. Match start bo‘ladi
19. Ikkala player 3D mapda ko‘rinadi
20. Player 1 yursa Player 2 ekranida ko‘rinadi
21. Player 2 attack qiladi
22. Player 1 HP kamayadi
23. Player 1 Player 2 ni o‘ldiradi
24. Player 2 dead bo‘ladi
25. Team 2 eliminated bo‘ladi
26. Player 1 winner bo‘ladi
27. Result screen chiqadi
28. XP va stats ko‘rinadi
29. Main Menu qaytish ishlaydi

Agar shu flow ishlasa, Maze Champions MVP frontend tugagan hisoblanadi.

35. Build talabi

Oxirida albatta:

npm run build

xatosiz ishlashi kerak.

Console’da critical error bo‘lmasin.

TypeScript xatolari bo‘lmasin.

Qisqa agent prompt varianti

Mana buni to‘g‘ridan-to‘g‘ri AI coding agentga tashlasa bo‘ladi:

You are a senior frontend and game UI developer. Build the full MVP frontend for a browser-based multiplayer voxel game called “Maze Champions”.

Use Next.js + React + TypeScript + TailwindCSS + Socket.io-client + React Three Fiber / Three.js.

The UI must be inspired by the attached reference image: a dark fantasy voxel maze arena, huge MAZE CHAMPIONS title, gold PLAY button, blue metallic secondary buttons, top-right user card, right MVP Mode panel, bottom role cards, bottom-left Latest Update panel, footer navigation. It should not look like a normal website or admin panel. It must look like a real game launcher and game MVP UI.

Implement the full MVP frontend, not only the homepage.

Required pages:
- / home page
- /lobby/[matchId]
- /match/[matchId]
- /result/[matchId]

Integrate APIs:
- POST /api/auth/guest
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/profile/me
- GET /api/profile/stats
- GET /api/game/meta
- POST /api/matches/create-lobby
- POST /api/matches/join-by-code
- GET /api/matches/:matchId/result

Implement Socket.io integration for:
- join_lobby_room
- lobby_updated
- create_team
- join_team
- select_role
- set_ready
- countdown_started
- countdown_tick
- countdown_cancelled
- match_started
- player_move
- player_moved
- player_attack
- attack_result
- player_damaged
- player_dead
- team_eliminated
- match_ended

Home page:
- match the reference image as closely as possible in layout, color, game atmosphere, and component placement.
- Include Play, Join by Code, Profile / Stats, Settings.
- Show user card, MVP mode panel, latest update panel, role cards, footer navigation.

Lobby page:
- show lobby code, player list, teams, role selection, ready button, countdown.
- support joining by code and real-time updates.
- allow solo/team selection.
- allow Warrior, Archer, Healer, Mage role selection.

Match page:
- create a basic playable 3D voxel maze scene.
- render own player and other players.
- support WASD movement and socket movement sync.
- render HP bars, role colors, game HUD.
- support basic attack/skill events from frontend.
- react to damage/death/team eliminated/match ended events.

Result page:
- show victory/defeat, winner team, kills, deaths, assists, damage, healing, survived time, XP breakdown, level before/after.
- Play Again and Main Menu buttons.

Important:
- Do not show password_hash anywhere.
- Use localStorage for token.
- Use clean component structure.
- Keep code production-ready.
- If some backend endpoint/event is missing, handle errors gracefully and keep UI stable.
- Build must pass with npm run build.