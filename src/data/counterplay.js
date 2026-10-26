// Original editorial advice. No cooldown seconds: haste, rank and game version change them.
const rows = `
Aatrox|Move out of blade edges and avoid extending a trade once he can repeatedly heal from hits.|Dash and blade sequence; punish after the final swing rather than during a ready combo.
Ahri|Keep a blocker or sidestep route against charm, then answer while her main control is unavailable.|Charm and remaining ultimate movement; do not chase blindly through a return angle.
Akali|Keep distance from shroud, protect low-health allies and save control for a visible re-entry.|Shroud and mobility commitments; a vanished target is not necessarily retreating.
Akshan|Deny safe ranged trades and stand where his swing route becomes difficult.|Swing path and passive attack sequence; pressure after he commits his escape.
Alistar|Spread slightly and keep the carry outside easy combo range; punish an entry the enemy carry cannot follow.|Headbutt and knockup availability; his defensive ultimate changes how much burst is useful.
Ambessa|Make her spend movement to approach, then use control when she commits rather than chasing each dash.|Energy and attack weaving; her next dash is tied to an ability use.
Amumu|Avoid clumping around a caught teammate and contest jungle space only with nearby lane support.|Bandage charges and ultimate; do not assume a first missed bandage removes all engage threat.
Anivia|Fight away from her prepared storm and avoid getting trapped between a wall and a choke.|Stun, wall and revival passive; check whether a kill attempt has a second stage.
Annie|Watch the stun indicator and avoid grouping at the edge of her engage range.|Stun preparation and ultimate; a spent stun gives a more manageable trading window.
Aphelios|Read his active weapons before trading and pressure from angles that make safe attacking difficult.|Weapon state and ammunition; different combinations change his range and close-range threat.
Ashe|Avoid being slowed in a long exposed lane; use cover against poke and track arrow angles.|Volley and ultimate; a missed arrow is an opportunity only if her support cannot stop your entry.
Aurelion Sol|Contest his early access to farm without overchasing, and leave his damage zones instead of fighting through them.|Flight commitment and major zone spells; punish predictable movement with teammates.
Aurora|Avoid giving her repeated free ranged trades and keep an exit from her fight area.|Movement cooldowns and ultimate zone; do not follow a retreat without checking its destination.
Azir|Fight outside useful soldier positions and threaten him when repositioning tools have been spent.|Soldier placement and dash; reserve a response for his defensive wall.
Bard|Respect unusual tunnel routes, ping roams and avoid chasing into a choke without vision.|Tunnel endpoints and ultimate stasis; time follow-up for when affected units become active again.
Bel'Veth|Deny a safe first takedown and use control when she commits to attacking instead of scattering at low health.|Directional dashes and defensive channel; her extended-fight state changes after takedowns.
Blitzcrank|Use minions as hook cover and avoid standing beside a low-health blocker that is about to die.|Hook; use the miss to recover space without walking into his remaining close-range control.
Brand|Separate from teammates and minions when his spell chain can spread; avoid staying in repeated passive damage.|Stun setup and ultimate; do not group around an already burning ally.
Braum|Back off when marked and attack from different angles instead of firing everything into his shield.|Passive marks and shield direction; re-enter when the mark expires or shield is unavailable.
Briar|Kite a committed pursuit toward your team and keep control ready for her arrival.|Frenzy commitment and disengage channel; do not assume she can freely change targets.
Caitlyn|Protect health while last-hitting, avoid trap lines and ask for help before a large wave enables a dive.|Net and traps; a used escape matters more than winning a single poke exchange.
Camille|Avoid giving a free shielded short trade and save an answer to her wall-based entry.|Passive shield, empowered attack timing and hookshot; fight after a failed or committed entry.
Cassiopeia|Dodge the poison setup before extending a trade and avoid dashing through a grounding zone.|Poison uptime and grounding; turn away from her ultimate when you can react safely.
Cho'Gath|Sidestep the delayed ground indicator and do not remain in execute range just to finish a wave.|Rupture, silence and ultimate threat; use a missed ground spell to reposition.
Corki|Avoid repeated rocket poke and make him spend movement before committing your chase.|Escape spell and empowered missile state; damage types and builds differ between games.
Darius|Keep trades short, avoid the outer blade and disengage before his passive fully develops.|Pull and blade cooldowns; do not re-enter with active bleed stacks merely because he steps back.
Diana|Spread before she enters and keep control or disengage ready for the commitment.|Moonlight setup, dash and ultimate; separate from her target rather than grouping around it.
Dr. Mundo|Use blockers against cleavers and deny repeated free recovery; choose anti-heal only when you can apply it usefully.|Passive control protection and healing ultimate; track whether the canister can be safely denied.
Draven|Pressure axe landing areas without walking into free attacks; deny an early cash-in rather than taking ego trades.|Axe catches and repositioning spell; missed catches reduce his immediate threat.
Ekko|Leave the stun-zone area and watch the return marker before spending your entire burst.|Defensive ultimate destination and stun setup; hold a response for the return if possible.
Elise|Use cover against cocoon and avoid being low under a stacked wave when her jungler route reaches you.|Cocoon and rappel; a failed catch creates a better window than fighting into all her forms' spells.
Evelynn|Group around vulnerable carries and place vision on likely approaches before walking into isolated space.|Charm preparation and ultimate escape; avoid following an unseen retreat alone.
Ezreal|Use minions to reduce direct skillshot pressure and force his blink before using your final gap closer.|Arcane Shift; a forward blink is a clearer punish window than a missed poke spell.
Fiddlesticks|Check likely flank spots with safe vision tools and avoid clustering beside unwarded walls.|Ultimate channel and fear setup; interrupt or disengage instead of feeding a hidden entry.
Fiora|Protect exposed vital angles and vary the timing of your control instead of offering an obvious parry.|Riposte; bait it before committing a decisive stun or knockup.
Fizz|Keep enough distance to avoid an easy ultimate and hold important damage until his evasive spell ends.|Playful / Trickster; punish its landing only if his other movement cannot carry him away.
Galio|Respect taunt range and ping when he can support a nearby fight; avoid grouping on the ally he is targeting.|Taunt and ultimate arrival; his landing changes the numbers in a fight.
Gangplank|Contest barrels when safe and avoid standing where a chain can reach your whole team.|Barrel health and chain setup; use a denied barrel to take space before a replacement is ready.
Garen|Prevent free recovery with safe pressure and avoid giving him a short trade that you cannot answer.|Silence, damage reduction and execute; leave before your health enters finishing range.
Gnar|Watch the rage bar and keep away from walls when a transformation can start a fight.|Rage and form; the next transformation matters more than judging him from his current size alone.
Gragas|Keep lateral space to dodge an approach and avoid lining up for a displacement into his team.|Body Slam and ultimate; a spent displacement creates more room for your carry.
Graves|Avoid point-blank duels and use spacing while he reloads; check nearby lane priority before invading.|Ammunition, dash and smoke; do not fight blind when vision is denied.
Gwen|Disengage from her prepared extended trade and do not assume you can hit her from outside mist.|Mist and stacked snip; wait out protection or approach with a coordinated plan.
Hecarim|Use flank vision and keep defensive control for his arrival; do not let his speed split your formation.|Charge and ultimate; peel the entry rather than chasing him away from your carry.
Heimerdinger|Clear turrets from safe range before fighting and avoid chasing through an established nest.|Turret setup and grenade; a cleared area is a better fight than one he prepared earlier.
Hwei|Approach from split angles and avoid forcing through repeated area spells in a choke.|His shared spell-family cooldowns; one cast limits which answer he can use next.
Illaoi|Leave the tentacle zone after she commits her ultimate and avoid offering both spirit damage and a close fight.|Spirit pull and ultimate; a missed pull offers a safer trade than fighting in active tentacles.
Irelia|Watch low-health minions that can become dash targets and avoid fighting into a prepared passive.|Passive stacks, stun and reset targets; a spent dash without a reset leaves less mobility.
Ivern|Do not chase his protected ally through repeated shields; contest with lane support and identify the actual damage threat.|Shield timing, root and companion; forcing utility before the real engage improves your odds.
Janna|Force one defensive response, then reassess before the second entry; avoid lining up in a narrow approach.|Tornado and ultimate disengage; one ready tool can stop a predictable commit.
Jarvan IV|Keep an answer for the flag-and-drag line and avoid trapping several allies inside his arena.|Flag combo and ultimate; hold movement if the arena would otherwise force a losing fight.
Jax|Avoid attacking into his dodge and keep a way to leave before the stun ends.|Counter Strike; short spell trades and disengage are safer than matching a prepared long duel.
Jayce|Use cover against ranged poke and answer after an aggressive melee switch if his exit is limited.|Empowered projectile combo and melee displacement; do not chase blindly after one missed shot.
Jhin|Respect the final shot and use reload windows to recover space without walking into his support.|Ammunition and root setup; being recently damaged can enable follow-up control.
Jinx|Deny a safe first takedown and approach from an angle rather than walking through her entire team.|Chompers and reset passive; protect low-health allies who could start the reset chain.
K'Sante|Stay away from walls that improve his isolation and reassess the fight after his form changes.|Charged control and All Out; do not treat every stage as the same tank matchup.
Kai'Sa|Avoid being isolated for her burst and keep defensive tools for a committed ultimate arrival.|Passive stacks and ultimate landing; teammates should be able to punish a deep entry.
Kalista|Interrupt her ability to keep attacking and avoid extending trades while spear stacks accumulate.|Rend stacks and attack-driven movement; a gap in attack access gives room to reset the trade.
Karma|Dodge the initial poke and leave tether range instead of remaining for the full control.|Empowered spell choice and shield; force one useful tool before committing another threat.
Karthus|Move unpredictably through his repeated ground spells and leave his death zone rather than finishing a fight inside it.|Ground-spell rhythm, passive duration and global ultimate; account for damage after death.
Kassadin|Use early wave pressure with safe vision and avoid giving free exits from short trades.|Riftwalk commitment and mana; longer sequences become expensive even when his mobility is high.
Katarina|Keep reliable control for her actual entry and move away from daggers that define her follow-up path.|Dagger positions, ultimate channel and takedown resets; do not spend all control before she arrives.
Kayle|Use early pressure without forcing a bad dive, then disengage during her protected damage window.|Level-based range changes and defensive ultimate; hold finishing damage if protection is still ready.
Kayn|Track wall approaches and identify his form before choosing how to defend.|Form, terrain movement and ultimate exit; his threat and durability depend on the form.
Kennen|Spread around objectives and ward side angles so he cannot enter unseen beside several carries.|Passive marks and ultimate; repeated marks make even a small trade unsafe.
Kha'Zix|Stay close enough to allies to deny easy isolated targets and protect low-health teammates.|Jump and isolation; do not peel away one at a time and create the target he needs.
Kindred|Do not contest a mark without lane support and plan damage timing around the survival zone.|Ultimate boundary and expiry; save control or finishing damage for the exit.
Kled|Respect mounted pressure and deny easy attacks during a dismounted chase.|Mount state, pull tether and remount progress; a nearly remounted target is not a free kill.
Kog'Maw|Force movement or disengage during his enhanced attack window, then pressure when it ends.|Bio-Arcane Barrage; his reach and repeated damage are much more threatening while it is active.
LeBlanc|Track where she can return and avoid chasing a clone or return path without information.|Distortion return and chain tether; break the tether and pressure a predictable return point.
Lee Sin|Use blockers against his first engage and keep your carry away from easy kick angles.|Sonic Wave and kick; follow-up mobility can remain even after the first missed ability.
Leona|Stay outside an easy entry and punish only when your carry can help; do not trade through a large enemy wave.|Zenith Blade and ultimate; a missed engage matters less if another control tool is still ready.
Lillia|Avoid letting her build speed from free hits and separate when several allies are marked for sleep.|Movement stacks and sleep marks; keep a response for the wake-up burst.
Lissandra|Respect her entry range and spread so one controlled target does not set up the whole fight.|Claw arrival and ultimate choice; wait out self-protection before spending crucial damage.
Locke|Avoid offering a long unchecked attack sequence and hold pressure for after his defensive commitment.|Health spent and movement commitment; confirm the current kit details before planning a precise burst threshold.
Lucian|Keep outside easy dash-and-burst range and punish the committed dash with your partner.|Dash and empowered attack sequence; do not confuse the end of one spell with the end of the trade.
Lulu|Force protection on one target, then reconsider your target or wait for a second entry.|Polymorph and ultimate; a protected carry is harder to burst while both remain ready.
Lux|Use lateral movement and avoid standing behind only one blocker when binding can reach further.|Binding and shield; a missed binding opens space, but her partner may still protect the approach.
Malphite|Keep carries separated and avoid a predictable cluster around an unwarded approach.|Ultimate availability; do not assume armor-heavy durability means equal protection against every damage type.
Malzahar|Break his passive protection before committing control and keep someone able to interrupt his channel.|Passive shield and suppression; an isolated carry has fewer answers than a protected one.
Maokai|Avoid blind bush approaches and keep the backline behind a screen that can respond to his entry.|Targeted root and ultimate wave; do not stand in the same follow-up line as the caught ally.
Master Yi|Keep reliable control until he is targetable and deny the first reset instead of scattering.|Alpha Strike return and defensive channel; coordinate control after he reappears.
Mel|Bait her defensive response before firing a high-value projectile and approach from more than one angle.|Projectile reflection; do not blindly commit your most important spell into a visible defensive window.
Milio|Force protection before committing a full engage and avoid granting the enemy carry free extended attacks.|Defensive knockback and cleanse/heal ultimate; use a second threat after the first response.
Miss Fortune|Avoid standing behind a low-health bounce target and approach from outside a safe ultimate angle.|Bullet Time channel; keep an interrupt or a clear path out before fighting in a choke.
Mordekaiser|Dodge the pull and leave repeated close-range damage rather than granting a free extended fight.|Pull and isolation ultimate; keep distance from a duel you cannot safely take.
Morgana|Use lateral movement and force her protective shield before using a decisive control spell.|Binding and Black Shield; spread away from active ultimate chains rather than grouping for a rescue.
Naafiri|Use teammates to contest her entry path and avoid standing alone after repeated ranged pressure.|Committed gap closer and pack pressure; punish an entry that does not reach a safe finishing target.
Nami|Avoid clumping for follow-up control and punish a missed bubble without chasing through her carry's damage.|Bubble and tidal wave; short poke trades are less valuable if she can safely heal them back.
Nasus|Control the wave early and kite later rather than volunteering a stationary duel.|Wither and ultimate; preserve movement or defensive tools for the actual slow-and-chase sequence.
Nautilus|Use minions against hook and avoid grouping around the target of his ultimate.|Hook and ultimate; keep an exit for follow-up control even after the first catch misses.
Neeko|Question unusual units or approach paths and spread when she enters close range.|Disguise and ultimate preparation; vision of the real approach is more useful than chasing the clone.
Nidalee|Block or sidestep spears and avoid staying isolated after being marked.|Hunt mark and cougar entry; punish a deep jump that has no nearby follow-up.
Nilah|Use range to control early trades and back away from her defensive attack-denial window.|Veil and dash commitments; avoid clumping when she can pull your team together.
Nocturne|Stay close enough to protect a carry and force his shield before spending reliable control.|Spell shield, fear tether and ultimate; group around the landing without lining up for enemy follow-up.
Norra|Avoid walking through prepared trinket zones and change angles while she charges a spell.|Charged cast and trinket placement; hold movement for the release rather than dodging too early.
Nunu & Willump|Sidestep the rolling approach and keep an interrupt for the large channel instead of fighting inside it.|Snowball and ultimate channel; objective secure tools make blind low-health contests risky.
Olaf|Create space before his protected chase and use terrain rather than relying only on control.|Ragnarok and axe pickup path; avoid offering easy repeated contact during his strongest window.
Orianna|Track the ball, not just Orianna, and avoid clustering near the ally carrying it.|Ball position and ultimate; a reposition can create threat from a different origin.
Ornn|Avoid a narrow grouped approach and keep room to move away from terrain-assisted control.|Brittle setup and ultimate recast; the second stage of his engage still matters after the first passes.
Pantheon|Respect empowered short trades and move around directional protection instead of unloading into it.|Empowered stun and defensive facing; punish after his protection ends if follow-up is safe.
Poppy|Avoid walls and bait her dash-denial zone before spending movement on a full entry.|Steadfast Presence and wall-stun angle; not every movement tool behaves like a dash.
Pyke|Use blockers against hook and protect low-health allies who could enable a reset chain.|Hook, dash return path and execute; disengage before several allies enter finishing range.
Qiyana|Avoid grouping beside useful terrain and track the element she prepared before an entry.|Element choice and terrain ultimate; fighting in open space can change the angles available to her.
Quinn|Use cover and measured trades, then ping when she leaves instead of following blindly.|Vault and roam window; push or protect with a plan rather than chasing into fog.
Rakan|Track the allies he can return to and spread enough that one entry cannot control everyone.|Engage and return anchors; punish a missed entry only if his escape route is unavailable.
Rammus|Avoid unnecessary attacks into his defensive stance and protect the taunted carry rather than chasing past him.|Defensive Ball Curl and taunt; time your main attack window after the defensive stance ends.
Rek'Sai|Respect early supported ganks and use vision around tunnel approaches.|Tunnel positions and knockup; repeated routes are easier to punish with nearby allies.
Rell|Keep spacing and punish a failed commitment without walking into the rest of her team's engage.|Crash-down entry and ultimate; an immobile-looking Rell may still have follow-up control.
Renata Glasc|Avoid clumping for her ultimate and account for the temporary survival tool before assuming a kill is secured.|Bailout and ultimate; prevent a protected target from earning a takedown during the survival window.
Renekton|Track Fury and avoid a full trade while his empowered combo is prepared.|Fury, stun and dash charges; answer after the burst only if he cannot safely retreat.
Rengar|Stay away from unwarded brush when isolated and keep defensive tools for his landing.|Brush access and empowered ability choice; low health can make a seemingly quiet area dangerous.
Riven|Space out the combo and keep control for a committed movement window.|Shield and remaining dashes; do not assume the first movement spell was her last.
Rumble|Leave the ultimate sideways instead of running along it and watch his heat before trading.|Heat and ultimate placement; forcing a bad overheat window can change the trade.
Ryze|Use range and avoid offering repeated spell cycles when he can safely stand and cast.|Rune setup and root; a portal also changes where allies or enemies may arrive.
Samira|Force her projectile defense, then keep a reliable interrupt for the ultimate.|Blade Whirl, style buildup and ultimate; one spent tool does not remove all of her entry threat.
Sejuani|Avoid an isolated catch and keep teammates able to respond without clumping for follow-up.|Ultimate and freeze setup; nearby melee allies can make her control more threatening.
Senna|Deny repeated safe trades and use cover against root; avoid letting every soul pickup become free pressure.|Root and long attack commitment; punish a predictable step forward with your partner.
Seraphine|Spread your approach so her spells cannot gain value through several teammates at once.|Ultimate and empowered spell rhythm; push forward only when her remaining control is accounted for.
Sett|Keep range when possible and sidestep the center of his return damage instead of standing still to finish him.|Grit and Haymaker; a low-health Sett can still have a large defensive and damage response.
Shaco|Avoid chasing through prepared boxes, check what you are targeting and protect isolated carries.|Deceive, boxes and clone; a visible retreat can be a route through more traps.
Shen|Avoid his taunt line and stop wasting attacks into his defensive zone.|Taunt, attack-blocking zone and global shield; a distant fight can suddenly gain another defender.
Shyvana|Respect her transformed fight window and avoid a stationary extended fight if she can keep hitting.|Form resource and transformation; use the weaker window to take safer space.
Singed|Do not chase through poison without a clear payoff and protect your own route to the objective.|Fling and grounding area; chasing often gives him the spacing and damage pattern he wants.
Sion|Move laterally out of charged attacks and avoid standing in a predictable line for his engage.|Charged smash and ultimate path; keep watching after death for his last pressure window.
Sivir|Force spell shield with a lower-value threat and approach from different angles.|Spell Shield and wave-clear commitment; short attack reach still constrains her trades.
Skarner|Screen his terrain-based approach and avoid leaving a carry alone at the front.|Approach angle and suppression; reserve a response for the moment he reaches the team.
Smolder|Pressure safe farm access without forcing a bad dive, then spread against repeated splash damage.|Stack progress and escape commitment; do not assume every stage has the same damage profile.
Sona|Pressure with your partner before she can sustain repeated free trades and keep a route past her frontline.|Ultimate and protection cycle; a spent engage response can open a brief second-entry window.
Soraka|Threaten her position or force her to move; apply healing reduction when it can affect the actual fight.|Silence field and healing access; do not commit a channel inside her silence zone.
Swain|Break contact when his sustained fight starts and avoid repeatedly walking back into his healing range.|Pull and ultimate uptime; disengage can be more useful than adding a little more burst.
Sylas|Check which ultimate he has and avoid granting a free healing trade at close range.|Stolen ultimate and healing dash; his next fight can change when the stored ultimate changes.
Syndra|Keep lateral room around spheres and look to enter after her displacement is spent.|Sphere positions and stun; the origin of the control can be away from her body.
Tahm Kench|Avoid repeated close-range marks and do not spend every tool on a target he can rescue.|Passive stacks, swallow and dive channel; track whether his protection was already used.
Taliyah|Avoid dashing through her prepared zone and vary your angle against displacement.|Unraveled Earth and shove; use spent control to approach rather than forcing through it.
Talon|Ward or respect wall routes and deny free roams by managing the wave.|Terrain route and burst commitment; peel his actual target instead of chasing the first retreat.
Taric|Separate or disengage during his delayed invulnerability and plan damage for after it expires.|Ultimate delay and stun line; avoid spending all burst just as protection arrives.
Teemo|Clear likely traps safely and time attack-focused trades around his blind.|Blinding Dart and mushroom coverage; a clear path is safer than chasing through unscouted ground.
Thresh|Use blockers for hook and avoid an entry that his flay can easily stop.|Hook and flay; lantern means the apparent isolated target may still have an escape.
Tristana|Avoid letting her finish a charge through free repeated attacks and keep control for a forward jump.|Charge stacks and jump reset; do not assume a committed jump always leaves her without a way out.
Trundle|Use space and terrain to deny repeated attacks and reassess after he steals defensive stats.|Pillar and ultimate; an armored frontline can lose durability during his strongest window.
Tryndamere|Kite through his survival ultimate and save a way to finish or disengage afterward.|Fury, spin and ultimate duration; committing all burst into active survival wastes it.
Twisted Fate|Respect the prepared card and protect side lanes when he can disappear from mid.|Gold Card and global ultimate; force him to spend the card before exposing a carry.
Twitch|Track likely stealth angles and protect low-health targets before he opens with a long attack line.|Camouflage and ultimate; turning on the revealed carry can be better than fleeing in a straight line.
Udyr|Keep space and note which empowered stance he has used before extending a fight.|Awakened stance and repeated attack access; his next response depends on the chosen stance.
Urgot|Avoid the displacement and move so he cannot rotate every damage angle into you.|Disdain and execute threat; leaving late at low health may not be enough.
Varus|Use cover against poke and spread against his ultimate before a choke fight.|Ultimate and passive-stack detonation; his item path changes whether poke or repeated attacks dominate.
Vayne|Pressure her limited wave clear early, avoid walls and deny uninterrupted repeated attacks.|Condemn angle and tumble; reliable control matters more than chasing every reposition.
Veigar|Do not rush through the cage edge; preserve a safe path and enter after the zone ends.|Event Horizon and burst ultimate; missing cage control creates his clearest defensive gap.
Vel'Koz|Dodge laterally, vary your approach and keep an interrupt or exit for his channel.|Knockup and ultimate; a missed defensive spell makes his immobility more punishable.
Vex|Watch her fear state and avoid unnecessary dashes when she is prepared to punish an approach.|Fear readiness and ultimate recast; a hit does not require her to enter immediately.
Vi|Stay close enough for teammates to punish her landing and avoid giving an isolated follow-up target.|Charged dash and targeted ultimate; protect the landing area rather than expecting the target to simply outrun it.
Viego|Protect the first low-health ally and hold a response for the reset rather than splitting your damage randomly.|Possession and ultimate resets; the first takedown can change the entire fight.
Viktor|Avoid standing in his control zone and approach from angles that force him to move before casting again.|Gravity field and damage cooldowns; a spent zone gives more room to contest his wave.
Vladimir|Force his pool before committing decisive control and avoid grouping for his area damage.|Pool and empowered healing spell; a low-health bait can still have a defensive answer.
Volibear|Break contact after his initial mark instead of granting repeated healing trades.|Frenzied Maul mark and ultimate; tower cover is not a complete plan during his dive window.
Warwick|Do not offer an isolated low-health chase and keep a response ready for suppression.|Fear and ultimate; account for increased recovery when he is low before assuming a duel is won.
Wukong|Identify the real entry, spread for knockups and avoid spending every control spell on a clone.|Decoy and ultimate stages; stay ready for a follow-up after the first knockup.
Xayah|Watch feather lines behind your champion and delay a full entry until her defensive response is spent.|Bladecaller and ultimate; movement through a feather return path can create the root you were avoiding.
Xerath|Vary movement while he channels and approach from a side angle rather than a narrow straight route.|Stun and charged poke; a missed stun is a more useful entry window than one missed long-range shot.
Xin Zhao|Deny repeated close-range attacks and protect his target after the first entry.|Third-hit knockup and ultimate zone; ranged allies may need to reposition instead of firing from outside it.
Yasuo|Track tornado preparation, avoid giving easy minion dash paths and wait out projectile defense.|Wind Wall and third thrust; non-projectile control and cross-angles need different answers.
Yone|Track his return point and sidestep the prepared long entry rather than chasing his moving spirit.|Spirit return and charged knockup; be ready for where he must return, not only where he currently stands.
Yorick|Reduce summon pressure when safe and avoid a blind side-lane duel in his prepared setup.|Summons and wall; a cleared setup changes the fight more than a small health advantage.
Yunara|Deny free sustained attacks and use reliable control after she commits to an enhanced fight window.|Enhanced form and attack uptime; hold a defensive response for the actual commitment.
Yuumi|Focus on the host's positioning and punish only safe detach windows; avoid splitting damage without a plan.|Attachment state and ultimate; protected targets still need to be isolated or controlled with follow-up.
Zaahen|Avoid an unchecked extended duel and coordinate damage rather than giving repeated recovery windows.|Stacked combat state and defensive commitment; check the current kit before assuming a low-health finish is safe.
Zac|Ward likely launch positions and spread so one landing cannot start control on the whole team.|Elastic entry and healing pickups; deny pickups only when it is safe to step forward.
Zed|Track shadow positions and preserve protection for the committed burst instead of using it on minor poke.|Shadow and ultimate return locations; a safe response needs to cover the exit as well as the entry.
Zeri|Use reliable movement control and avoid giving her a long chase through safe terrain.|Wall movement and ultimate; break the extended fight if her team is enabling uninterrupted attacks.
Ziggs|Approach from more than one angle and avoid repeatedly taking poke in a narrow objective path.|Satchel escape and wave-clear commitment; a spent escape offers a clearer entry window.
Zilean|Separate from bomb targets and avoid spending every finishing spell on an active revival.|Double-bomb setup and revival; prepare control for the return or temporarily switch targets.
Zoe|Use blockers and vision against sleep and punish a known return location without chasing too far.|Sleep and portal return; the predictable landing can matter more than her current position.
Zyra|Avoid fighting inside prepared plants and keep a lateral route against her root.|Root and ultimate zone; contest space after control is spent rather than forcing through the full setup.
`;

const rowNames = rows.trim().split('\n').map(row => row.split('|')[0]);
if (new Set(rowNames).size !== rowNames.length) throw new Error('Duplicate champion row');
export const counterplayGuides = Object.fromEntries(rows.trim().split('\n').map(row => {
  const [name, counterplay, keyWindow] = row.split('|');
  if (!keyWindow) throw new Error(`Incomplete counterplay: ${name}`);
  return [name, { counterplay, keyWindow }];
}));
