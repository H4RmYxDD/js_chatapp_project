# js_chatapp_project
feladat:
15. Felhasználók közti üzenetküldő rendszerA regisztrált felhasználók egymásnak üzeneteket küldhetnek.
Minden üzenethez tartozhatnak válaszok (thread jelleggel), így beszélgetések láncolata alakulhat ki.
Nincs valós idejű frissítés – a kliens időnként lekéri az adatokat.

Végpontok:
POST /api/register – új felhasználó létrehozása
POST /api/login – bejelentkezés (JWT token visszaadása)
GET /api/users – felhasználók listája (pl. címzett kiválasztásához)
POST /api/messages – új üzenet küldése body: { recipient_id, content, parent_id (opcionális) }
GET /api/messages – bejelentkezett felhasználó összes üzenetének lekérése (kapott és küldött)
GET /api/messages/conversation/:userId – beszélgetés két felhasználó között
GET /api/messages/thread/:id – egy üzenet és a rá adott válaszok lekérése

Adatbázis táblák:
users(id, username, email, password_hash)
messages(id, sender_id, recipient_id, content, parent_msg_id, created_at, is_read)

Frontend:
Bejelentkezés / Regisztráció oldal
Felhasználólista oldal - Összes regisztrált felhasználó megjelenítése (kivéve a bejelentkezett)
„Üzenet küldése” gomb minden felhasználó mellett
Üzenetek oldal - Beérkezett és elküldött üzenetek listája
Minden üzenethez: küldő neve, időpont, tartalom, „Válasz” gomb
Üzenetszál nézet - Egy üzenet és az arra érkezett válaszok
Új válasz