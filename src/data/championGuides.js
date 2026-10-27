// Editorial strategy, not measured matchup results. Lane order lists the main role first.
// Columns: champion | lanes (B/J/M/D/S) | typical damage | class | traits | plan | risk.
const rows = `
Aatrox|B|physical|fighter|frontline,sustain|Space your blade edges and extend trades only while your healing can keep you in the fight.|Missed sweet spots and repeated disengage make long trades difficult.
Ahri|M|magic|mage|pick,mobile|Threaten charm from an angle, then move with your jungler after clearing the wave.|Using every dash offensively leaves no escape if the pick fails.
Akali|M,B|magic|assassin|dive,mobile|Use shroud and short trades to create a later all-in; enter teamfights after key control is used.|A direct entry into grouped crowd control wastes your mobility.
Akshan|M,B|physical|marksman|early,mobile|Pressure with short ranged trades and use terrain to choose safe swing paths.|A blocked swing or a long melee fight can remove your escape.
Alistar|S|magic|tank|frontline,engage,peel,knockup|Use threat of your combo to control space; protect your carry when an engage cannot be followed.|Engaging beyond allied damage range can leave you isolated.
Ambessa|B|physical|fighter|dive,mobile|Alternate abilities and attacks to keep your resource flowing while repositioning.|Repeated dashes without useful attacks can leave you unable to finish or exit.
Amumu|J|magic|tank|frontline,engage,knockup|Look for grouped enemies and arrive with teammates who can follow your control.|An early invade or unsupported engage can punish your dependence on nearby allies.
Anivia|M|magic|mage|waveclear,peel,immobile,scaling|Use wall and storm to divide a fight and control narrow approaches.|Mana pressure and flanks are dangerous when escape routes are blocked.
Annie|M,S|magic|mage|pick,engage,immobile|Track your stun and threaten a short burst window with it ready.|Spending the stun casually gives enemies a safer window to approach.
Aphelios|D|physical|marksman|sustained,scaling,immobile|Plan fights around your current weapons and keep enough room to attack behind allies.|Weapon mismatch and diving enemies can punish a fight taken without setup.
Ashe|D,S|physical|marksman|pick,peel,immobile,sustained|Use slows to control trade length and arrow to start a fight your team can reach.|You have no dash; stepping forward without vision can turn pressure into a catch.
Aurelion Sol|M|magic|mage|scaling,waveclear|Collect safe farm and fight around zones that keep enemies in your damage.|Greedy farming or a predictable flight can expose you before your damage develops.
Aurora|M,B|magic|mage|mobile,poke|Use short trades and reposition before enemies can answer; reserve an escape route.|Treating mobility as permission to stay in melee range invites retaliation.
Azir|M|magic|mage|sustained,scaling,peel|Control space with soldiers and prioritize safe damage before attempting an engage.|A flashy forward dash can remove the positioning advantage your team needs.
Bard|S|magic|support|pick,peel,mobile|Roam after a safe wave state and use terrain routes to create numbers advantages.|Leaving your carry under a large wave can cost more than a speculative roam gains.
Bel'Veth|J|physical|fighter|sustained,scaling,reset|Use safe clear tempo to reach fights where a takedown lets you keep attacking.|Entering first into reliable control can stop your extended-fight plan.
Blitzcrank|S|magic|tank|pick,peel,knockup|Pressure with hook threat from fog and choose targets your team actually wants nearby.|Pulling a durable engager into your carry can help the enemy.
Brand|S,M,D|magic|mage|poke,waveclear,immobile|Spread spells through grouped enemies and use your stun setup to protect your casting space.|Your damage takes setup; getting caught before the combo limits your contribution.
Braum|S|magic|tank|frontline,peel,knockup|Stand between threats and your carry; coordinate attacks to complete passive stuns.|Passive marks alone do not guarantee a stun when allies cannot attack safely.
Briar|J|physical|fighter|dive,sustain|Choose fights where your target commitment is safe and keep a way to stop an overchase.|Forced pursuit can carry you into towers or a waiting enemy team.
Caitlyn|D|physical|marksman|poke,early|Pressure last hits with range and place traps under existing control.|A pushed lane needs vision; range does not protect you from a flank.
Camille|B|physical|fighter|dive,split|Use short trades around your shield, then isolate a target when allies can follow.|Committing your movement before checking enemy control can trap you in a losing fight.
Cassiopeia|M,D|magic|mage|sustained,antiTank,immobile|Land poison before committing repeated damage and use grounding to deny an approach.|Missing setup or draining mana makes prolonged trades much less threatening.
Cho'Gath|B|magic|tank|frontline,peel|Use crowd control to protect your approach and secure safe growth from your ultimate.|Slow skillshots and a large body can make you easy to kite.
Corki|D,M|mixed|marksman|poke,waveclear|Soften enemies with ranged spells and keep your movement available for a safe damage angle.|Build and damage distribution differ by game; do not assume one version's setup transfers.
Darius|B|physical|fighter|frontline,early|Threaten extended trades when you can keep contact and land the outer blade.|Ranged spacing and repeated disengage can stop your passive from building.
Diana|J,M|magic|fighter|dive,engage|Enter after allies can follow and look for enemies close enough to catch together.|Diving into spread targets or ready disengage can strand you.
Dr. Mundo|B|mixed|tank|frontline,sustain|Use ranged farming when pressured and absorb damage only while your recovery can keep up.|Healing reduction and sustained damage can cut through a lead in durability.
Draven|D|physical|marksman|early,sustained|Pressure when axe catches are safe; turn a lead into purchases before forcing more fights.|Axe landing positions are predictable and can expose you to control.
Ekko|J,M|magic|assassin|dive,mobile|Create a stun-zone threat, use a short burst window and track your return position.|Your escape is less useful if its destination is unsafe or control prevents activation.
Elise|J|magic|mage|early,pick,dive|Use lane priority to approach from an unexpected angle and convert a catch into an objective.|Repeated failed ganks can leave your farm and level behind.
Evelynn|J|magic|assassin|dive,scaling|Farm safely toward your stealth threat, then approach isolated targets from unexpected angles.|Vision control and grouped enemies reduce the safe targets you can reach.
Ezreal|D|physical|marksman|poke,mobile|Farm with skillshots when pressured, but add attacks when safe and preserve your blink.|Minions block your main poke; safety does not guarantee wave priority.
Fiddlesticks|J|magic|mage|engage,immobile|Prepare vision denial before an ultimate angle and let enemies enter your threat area.|Starting a channel in vision or being interrupted can waste your main fight window.
Fiora|B|physical|fighter|split,antiTank,sustain|Take trades around accessible vitals and save your parry for a meaningful response.|A missed parry or forced front-to-back fight can reduce your dueling advantage.
Fizz|M|magic|assassin|dive,mobile|Use short trades and keep your evasive spell for the enemy's most important response.|Using your escape only for damage can leave you exposed after the burst.
Galio|M,S|magic|tank|frontline,peel,engage|Push safely and support nearby fights with control and defensive arrival.|Moving without lane priority can cost farm and still arrive too late.
Gangplank|B|physical|fighter|scaling,poke,waveclear|Set barrels before the enemy walks into range and use global pressure without abandoning farm.|Destroyed barrels and rushed chains can remove most of your fight threat.
Garen|B|physical|fighter|frontline,split|Take a short trade, recover between exchanges and choose a vulnerable target to finish.|Repeated ranged pressure can prevent recovery and deny your approach.
Gnar|B|physical|fighter|poke,engage|Manage rage before objectives so your durable form arrives when the team can fight.|The wrong form at the wrong time can leave you unable to engage or escape.
Gragas|B,J,M|magic|tank|frontline,engage,peel|Use displacement to isolate a threat or protect a carry; decide the purpose before casting.|A poorly aimed ultimate can push an enemy away from allied damage.
Graves|J|physical|marksman|sustained,mobile|Use terrain and clear tempo to take favorable skirmishes while tracking lane priority.|Reload windows, blocked attacks and reliable control can punish close-range fighting.
Gwen|B,J|magic|fighter|sustained,antiTank,split|Stack your damage setup, then use mist to create a protected extended trade.|Mist is not safety from enemies already inside it; avoid being surrounded.
Hecarim|J|physical|fighter|dive,engage|Approach from the side with your team in range to turn your entry into damage.|A fast engage can outrun your allies and leave you deep in enemy territory.
Heimerdinger|M,B,D|magic|mage|waveclear,peel,immobile|Fight inside prepared turret coverage and use that pressure to control the wave.|Chasing away from your setup removes much of your protection.
Hwei|M,D|magic|mage|poke,waveclear,immobile|Choose spells for the immediate job: clearing, zoning or stopping an approach.|Using your defensive option for damage can expose you to a dive.
Illaoi|B|physical|fighter|frontline,sustain|Set up tentacles and punish enemies who choose to fight in your prepared area.|Chasing or fighting away from tentacles makes your threat easier to avoid.
Irelia|B,M|physical|fighter|dive,sustained|Use minion health and passive stacks to prepare an entry instead of forcing a raw dash.|A missed reset or a wave with no exit route can leave you stranded.
Ivern|J|magic|support|peel,shield|Path around lane needs and use shields and your companion to support an ally's fight.|Invading alone or expecting carry-level burst can waste your utility advantage.
Janna|S|magic|support|peel,shield,knockup|Keep disengage for the threat that can reach your carry and use short safe trades.|Spending every defensive tool for poke creates an entry window for the enemy.
Jarvan IV|J|physical|fighter|frontline,engage,knockup|Choose an entry your allies can reach and use terrain control to isolate priority targets.|Your arena can also trap allies with dangerous enemies.
Jax|B,J|mixed|fighter|split,sustained|Trade around your defensive window and keep a jump target available before extending.|Ability damage and crowd control still matter while you deny attacks.
Jayce|B,M|physical|fighter|poke,early|Use ranged pressure first, then switch to melee only when the trade is favorable.|Blindly switching into melee can expose you after your poke cooldowns are spent.
Jhin|D|physical|marksman|pick,poke|Time trades around ammunition and use allied damage to set up your root.|Reload windows limit extended damage; a burst opening is not an unlimited all-in.
Jinx|D|physical|marksman|sustained,scaling,immobile,reset|Deal safe damage behind allies until a takedown opens a reset; use rocket range deliberately.|Entering before enemy engage is committed can end the fight before a reset happens.
K'Sante|B|physical|tank|frontline,peel|Protect space in your durable form and isolate a target only when the tradeoff is worthwhile.|Changing form or chasing a duel can leave your backline without protection.
Kai'Sa|D|mixed|marksman|dive,sustained,scaling|Follow allied control when it is safe and plan purchases around your intended evolutions.|An ultimate into an unreachable backline can separate you from your team.
Kalista|D|physical|marksman|early,sustained|Use repeated attacks while maintaining spacing and coordinate commits with your bound ally.|Slows and reliable control can disrupt the movement your trades depend on.
Karma|S,M|magic|support|poke,shield,peel|Use ranged trades to create space and empowered protection when allies must reposition.|Using all protection offensively makes a return engage more dangerous.
Karthus|J,M,D|magic|mage|sustained,scaling,immobile|Farm efficiently and fight where enemies must pass through your damage area.|You need time to deal damage; scattered fights and early pressure can limit it.
Kassadin|M|magic|assassin|scaling,mobile,dive|Preserve health through difficult early waves and look for side angles after gaining mobility.|Forced early fights and physical pressure can delay your main threat window.
Katarina|M|magic|assassin|dive,reset|Wait for key enemy control to be used, then enter where a takedown can chain into another.|Entering first into ready crowd control often prevents any reset.
Kayle|B,M|mixed|marksman|scaling,sustained|Prioritize safe experience and choose defensive ultimate timing before greedily adding damage.|Early wave pressure and repeated dives can deny the levels your plan needs.
Kayn|J|physical|fighter|mobile,dive|Choose routes and fights that suit your intended form, then adapt your target selection.|The forms serve different jobs; one generic build or engage plan will not fit both.
Kennen|B|magic|mage|engage,poke|Use ranged trades and approach fights from a flank that your team can follow.|Walking straight at a spread team can reveal your engage before it reaches anyone.
Kha'Zix|J|physical|assassin|dive,mobile|Look for isolated targets and keep an exit available before using your jump.|Grouped enemies deny isolation and can punish a committed entry.
Kindred|J|physical|marksman|sustained,scaling|Use lane priority to contest marks and place your ultimate where allies benefit most.|Chasing a mark without support can cost more than the mark is worth.
Kled|B|physical|fighter|early,engage,dive|Use your mounted durability to pressure and coordinate your charge with nearby allies.|A forced fight while dismounted can deny the attacks needed to remount.
Kog'Maw|D|mixed|marksman|sustained,antiTank,scaling,immobile|Fight during your range window and use allied protection to keep attacking the nearest safe target.|No dash and a limited range window make unsupported forward movement risky.
LeBlanc|M|magic|assassin|poke,mobile,pick|Create short trades from an angle and track your return point before committing.|Predictable returns and reliable control can punish your escape pattern.
Lee Sin|J|physical|fighter|early,mobile,knockup|Use early skirmish windows with lane support and choose kicks for either a pick or peel.|A difficult combo is less useful than a safe play your team can follow.
Leona|S|magic|tank|frontline,engage,pick|Threaten a short-distance all-in when your carry can immediately add damage.|Once committed, you have limited disengage if your partner cannot follow.
Lillia|J,B|magic|fighter|sustained,mobile|Build movement through safe spell hits, then threaten a multi-target sleep.|Reliable control or a burst entry can stop you before your movement builds.
Lissandra|M|magic|mage|pick,engage,peel|Use reliable control to set up an ally and save self-protection when diving is unsafe.|Using every tool to engage can leave no answer to the enemy's return damage.
Locke|M|magic|assassin|dive,sustain|Choose short entry windows and account for the health you spend before committing to damage.|Sustaining through a trade is not guaranteed if enemies can finish you during it.
Lucian|D|physical|marksman|early,mobile|Trade with spell-and-attack sequences when your partner can support the commitment.|A forward dash removes your easiest answer to a return engage.
Lulu|S|magic|support|peel,shield,knockup|Protect the ally who can keep dealing damage and save disruption for the main diver.|Using every buff for pressure can leave no protection for the enemy's commit.
Lux|S,M|magic|mage|poke,pick,shield,immobile|Use binding threat to control approaches and follow allied control with your burst.|A missed binding leaves an obvious window for enemies to close distance.
Malphite|B|magic|tank|frontline,engage,knockup|Use your durable lane pattern and hold ultimate for a reachable priority target or a peel emergency.|An unsupported ultimate or heavy magic pressure can undermine your usual durability plan.
Malzahar|M|magic|mage|pick,waveclear,immobile|Use wave pressure to create safe movement and reserve suppression for a target allies can hit.|Your channel can be interrupted by other enemies if you stand too far forward.
Maokai|J,S,B|magic|tank|frontline,engage,peel|Control approaches with vision tools and lock down a target in allied damage range.|Following a target too deep can pull you away from the carry you need to protect.
Master Yi|J|physical|fighter|sustained,scaling,reset|Enter after hard control is used and attack the safest available target until a reset opens.|Reliable crowd control and early invades can stop your damage before it starts.
Mel|M|magic|mage|poke,immobile|Trade from range and reserve your defensive response for a high-value incoming spell.|A wasted defensive cooldown invites a follow-up attack before it returns.
Milio|S|magic|support|peel,shield,heal|Use protection and extra reach to help a carry attack without surrendering safe spacing.|You need allied damage; face-checking or initiating alone wastes your strengths.
Miss Fortune|D|physical|marksman|poke,early,immobile|Use bounce pressure in lane and a protected ultimate angle after allied control.|Ready interrupts or a flank can end your channel before it pays off.
Mordekaiser|B|magic|fighter|frontline,sustained|Keep enemies in your damage zone and isolate the opponent whose removal helps the fight.|A duel you cannot win or a target your team needed to finish can backfire.
Morgana|S,M|magic|mage|pick,shield,immobile|Use binding to set up damage and protect the ally facing a crucial crowd-control spell.|Shield choice and timing matter; it does not erase every type of incoming damage.
Naafiri|M,J|physical|assassin|dive,poke|Pressure with ranged hits before committing to a target your team can reach.|A predictable forward entry can be intercepted or punished by nearby defenders.
Nami|S|magic|support|heal,peel,knockup|Time attack buffs with your carry's trade and use slows to make later control easier.|A raw bubble is unreliable; missing it leaves a limited defensive response.
Nasus|B|physical|fighter|scaling,split|Preserve health while stacking and use your slow to create a manageable extended fight.|Giving up every wave to stack safely can still leave your team without pressure.
Nautilus|S|magic|tank|frontline,engage,peel,knockup|Use reliable control to start a reachable fight or stop the enemy who reaches your carry.|A hook into the wrong target can commit you farther than allies can follow.
Neeko|M,S|magic|mage|engage,pick|Create uncertainty with disguise and attack from an angle after enemy vision is checked.|A visible, predictable approach gives opponents time to avoid your control.
Nidalee|J|magic|mage|early,poke,mobile|Use clear tempo and spear pressure to take supported skirmishes.|Jumping in without a useful hit or nearby allies can turn poke into a losing all-in.
Nilah|D|physical|marksman|sustained,dive|Preserve health until your support can create a close-range fight you can sustain.|Short reach and a committed dash make unsupported trades costly.
Nocturne|J|physical|fighter|dive,pick|Use ultimate pressure when an isolated enemy is visible and your lane can follow.|Diving a bait target without tracking the rest of the team is dangerous.
Norra|M|magic|mage|poke,immobile|Prepare trinket zones and aim charged spells through the space enemies must cross.|Charging slows your movement and can expose you to a fast approach.
Nunu & Willump|J|magic|tank|frontline,engage|Use rolling approaches with lane support and reserve your objective tools for a planned contest.|Predictable routes and interrupted channels reduce your fight impact.
Olaf|B,J|physical|fighter|sustained,early|Choose extended fights where repeated axe hits let you stay in contact.|Kiting and terrain can waste your threat window even when control cannot stop you.
Orianna|M|magic|mage|waveclear,shield,peel|Keep track of the ball and use it to control space before committing your ultimate.|Your damage and protection depend on ball position, not just your champion's position.
Ornn|B|magic|tank|frontline,engage,knockup|Take controlled trades and save a clear angle for a team-followed engage.|Long-range poke and badly timed engages can prevent you from delivering control.
Pantheon|B,M,J,S|physical|fighter|early,pick|Use empowered short trades and turn lane priority into a supported roam.|An ultimate arrival without allies or an exit can trade away your early advantage.
Poppy|B,J,S|physical|tank|frontline,peel|Hold your dash denial for a real entry threat and use walls to improve control.|Using defensive tools for minor damage can remove your answer to a later dive.
Pyke|S|physical|assassin|pick,mobile,reset|Threaten catches from fog, then roam only when your carry can safely handle the wave.|You cannot substitute for a durable frontline in a prolonged open fight.
Qiyana|M,J|physical|assassin|dive,mobile|Plan your element and terrain before entering; threaten fights near useful walls.|An entry with no useful terrain or exit leaves less room to recover a missed combo.
Quinn|B|physical|marksman|early,mobile,split|Use ranged trades to earn a safe roam window and return before losing too much farm.|Roaming from a bad wave or into unseen control gives away your lane advantage.
Rakan|S|magic|support|engage,peel,knockup|Use allied positions as entry and exit points and keep the engage within follow-up range.|Engaging without an ally to return to makes your exit much less reliable.
Rammus|J|magic|tank|frontline,engage,pick|Target attack-reliant threats and use your control where allies can add damage.|Magic-heavy teams and opponents who can kite you reduce your preferred matchup value.
Rek'Sai|J|physical|fighter|early,pick,knockup|Use tunnels and information to approach a supported early fight.|Repeated low-value ganks can cost the tempo you need to stay relevant.
Rell|S|magic|tank|frontline,engage,knockup|Look for grouped targets and commit when teammates are ready to follow your control.|A missed entry can leave you slow and exposed.
Renata Glasc|S|magic|support|peel,shield|Use protection on the ally who can earn a takedown and control the enemy's path into your team.|Your rescue tools need good timing and do not replace safe positioning.
Renekton|B|physical|fighter|early,frontline|Manage Fury and use short empowered trades before retreating through a safe route.|A trade without resource or an exit can lose the early pressure you rely on.
Rengar|J,B|physical|assassin|dive,pick|Use brush and information to choose a vulnerable target, then plan your empowered response.|A jump into grouped protection can turn your burst into an isolated death.
Riven|B|physical|fighter|mobile,split|Trade around your shield and control, keeping part of your movement for the return.|Spending all mobility on damage makes the next enemy cooldown cycle dangerous.
Rumble|B,M|magic|mage|poke,waveclear|Manage heat and place your ultimate across an enemy route rather than behind it.|Poor heat management or being forced into a bad angle limits your control.
Ryze|M|magic|mage|sustained,waveclear,scaling|Use safe wave control and repeated spell cycles before looking for a coordinated move.|Short spell reach and unreliable team coordination can punish an ambitious portal play.
Samira|D|physical|marksman|dive,reset|Stack Style with ranged abilities before diving in with Wild Rush and Inferno Trigger behind allied crowd control.|Displacements like Janna's Monsoon and untargetable escapes like Xayah's Feather Storm cancel or dodge your ultimate channel.
Sejuani|J|magic|tank|frontline,engage,pick|Coordinate close-range follow-up and use your ultimate to catch a target allies can reach.|A distant catch without follow-up may spend your best engage for little gain.
Senna|S,D|physical|marksman|poke,heal,scaling,immobile|Collect safe souls and trade from range while keeping a retreat route.|Long attack commitments and no dash make hooks and flanks dangerous.
Seraphine|S,D,M|magic|mage|waveclear,shield,peel|Play through allies and extend control chains before using your teamfight spells.|You need spacing and follow-up; isolated fights are less reliable.
Sett|B|physical|fighter|frontline,engage|Trade where enemies must stay close and aim your damage return before they disengage.|Ranged spacing can deny your preferred trades and dodge the center of your return damage.
Shaco|J|physical|assassin|pick,dive|Prepare boxes and approach from an unexpected angle rather than forcing a direct fight.|Predictable routes and grouped enemies reduce the value of deception.
Shen|B|physical|tank|frontline,peel|Trade around your defensive zone and watch for a useful shield arrival across the map.|Leaving a bad wave or teleporting into a lost fight can cost both lanes.
Shyvana|J|mixed|fighter|sustained,scaling|Farm efficiently and plan engagements around your transformed threat window.|Forcing fights without your form or lane support can give away your scaling plan.
Singed|B|magic|tank|frontline,mobile|Create pressure through movement and disrupt a fight without standing still to trade.|Running into unseen enemies or forcing proxy pressure blindly can become repeated deaths.
Sion|B|physical|tank|frontline,engage,waveclear|Use wave control and charged threat to protect space for your team.|Slow casts and predictable charges are vulnerable to mobile opponents.
Sivir|D|physical|marksman|waveclear,sustained|Manage the wave and save spell shield for a meaningful threat before starting a chase.|Short attack reach still matters even when your wave clear is strong.
Skarner|J|physical|tank|frontline,engage|Use terrain approaches and crowd control to deliver targets to allied damage.|A committed approach without follow-up can leave your backline exposed.
Smolder|D|physical|marksman|scaling,poke,waveclear|Stack safely while preserving enough health to contest later waves and objectives.|Stacking greed can expose you to a dive before your scaling becomes useful.
Sona|S|magic|support|heal,shield,scaling,immobile|Use safe repeated utility and save your ultimate to stop or start a reachable fight.|Fragile early spacing and heavy engage can punish careless poke.
Soraka|S|magic|support|heal,peel,immobile|Trade safely to support your healing cycle and place silence where enemies must commit.|You are a priority target; healing allies is difficult while you are being focused.
Swain|M,S,D|magic|mage|sustain,frontline|Pull enemies into a fight that stays within your sustained damage and healing range.|Long-range disengage and burst before your fight develops can deny your plan.
Sylas|M|magic|fighter|dive,sustain|Choose fights around your available stolen ultimate and the enemy's key cooldowns.|Not every enemy ultimate is equally useful; do not draft him on damage alone.
Syndra|M|magic|mage|pick,poke,immobile|Use sphere setup to threaten a stun and keep your defensive response available against dives.|Spending your displacement casually creates a clear window to reach you.
Tahm Kench|B,S|magic|tank|frontline,peel|Take measured close-range trades and reserve your rescue for an ally who can still be saved.|Using protection selfishly can leave your carry exposed to the next engage.
Taliyah|M,J|magic|mage|waveclear,peel|Use terrain control to shape movement and save your displacement for a predictable approach.|A missed control combo can leave an immobile caster in easy reach.
Talon|M,J|physical|assassin|dive,mobile|Use wave or clear tempo to reach a side angle and leave before a prolonged fight.|A roam without priority can lose farm while the enemy safely tracks you.
Taric|S|magic|support|peel,heal|Stand where you can protect an ally while timing your delayed protection before damage lands.|The delay means a late ultimate may not save an ally already being burst.
Teemo|B|magic|marksman|poke,split|Use ranged trades and prepare vision traps around the route you need to defend.|Overextending for poke leaves limited escape against a coordinated gank.
Thresh|S|magic|support|pick,peel|Use hook threat to control space and keep lantern available for an ally who needs an exit.|Taking every landed hook can turn a good catch into a bad commitment.
Tristana|D,M|physical|marksman|mobile,scaling|Use explosive-charge pressure when you can finish the trade and keep jump for a safe exit.|Jumping in before a reset is secure can trap you in enemy range.
Trundle|B,J|physical|fighter|split,sustained|Use pillar to keep contact and choose a durable target when stealing stats helps the fight.|Ranged disengage and poor target choice can waste your strongest window.
Tryndamere|B|physical|fighter|split,sustained|Manage Fury for trades and use side-lane pressure with a clear escape route.|Control and kiting can consume your survival window without letting you attack.
Twisted Fate|M|magic|mage|pick,waveclear|Prepare a useful card and use wave priority before committing to a side-lane play.|Arriving without allied follow-up can turn a global advantage into an isolated fight.
Twitch|D|physical|marksman|scaling,sustained,immobile|Use stealth to choose a firing angle and enter once enemy threats are occupied.|Opening too close to reliable control can end your damage window immediately.
Udyr|J,B|mixed|fighter|frontline,sustained|Choose your empowered stance for the job and use movement to maintain contact.|One stance cannot solve every fight; ranged teams can punish a direct approach.
Urgot|B|physical|fighter|frontline,sustained|Trade where you can rotate damage around the target and reserve displacement for a real commit.|Slow movement and missed displacement make ranged pressure difficult.
Varus|D|mixed|marksman|poke,pick,immobile|Choose a poke or sustained-damage plan and use your ultimate to create space or start a catch.|Different builds solve different problems; no dash makes vision and spacing essential.
Vayne|D,B|physical|marksman|sustained,antiTank,scaling|Preserve health in lane and use spacing to earn repeated attacks on a safe target.|Short range and limited wave control make early pressure and large waves difficult.
Veigar|M,D|magic|mage|scaling,peel,immobile|Use cage to control a route and farm safely before committing your burst.|A wasted cage leaves a long window for enemies to close distance.
Vel'Koz|M,S|magic|mage|poke,immobile|Use angled spells to build pressure and reserve control for enemies entering your range.|Your channel and lack of dash make flanks and ready interrupts dangerous.
Vex|M|magic|mage|pick,dive|Track your fear and look for an ultimate follow-up after an enemy becomes vulnerable.|A landed ultimate is not a safe entry if nearby enemies still hold control.
Vi|J|physical|fighter|dive,engage|Choose a reachable priority target and commit when your team can follow the lockdown.|Point-and-click entry still fails if it takes you beyond allied support.
Viego|J|physical|fighter|sustained,reset|Follow an ally's opening and focus the first safe takedown before chasing resets.|Entering first into burst and control can deny the possession chain entirely.
Viktor|M|magic|mage|waveclear,scaling,immobile|Use wave control and zoning to reach longer fights from a protected position.|Early pressure and flanks can force you away from the space you need.
Vladimir|M,B|magic|mage|scaling,sustain|Preserve health and experience, then enter grouped fights from a side angle.|Using your defensive pool too early leaves a window before the next damage cycle.
Volibear|B,J|mixed|fighter|frontline,engage,sustain|Commit to a target you can keep hitting and use your control to support repeated trades.|Kiting can deny the repeated contact that sustains you.
Warwick|J,B|mixed|fighter|sustain,pick|Track low-health opportunities without abandoning farm and use suppression in allied reach.|Chasing blood trails into unseen enemies can turn a favorable duel into a collapse.
Wukong|J,B|physical|fighter|frontline,engage,knockup|Use deception to approach and time your knockups with allied follow-up.|A visible entry without backup can waste your strongest teamfight window.
Xayah|D|physical|marksman|sustained,peel|Place feathers across the enemy's approach and hold your defensive ultimate for a real threat.|Poor feather positions make a root unreliable even when enemies are close.
Xerath|M,S|magic|mage|poke,immobile|Use range to pressure safely and keep stun available when enemies can approach.|Long casts and no dash make unwarded side angles especially dangerous.
Xin Zhao|J|physical|fighter|early,frontline,knockup|Use early dueling with lane support and isolate a manageable fight with your ultimate.|Charging beyond allied reach can leave you fighting several close-range enemies.
Yasuo|M,D,B|physical|fighter|sustained,mobile,knockup|Use minions and prepared knockups to create a safe entry, preserving wind defense for a key threat.|A dash path with no exit or no useful knockup can force a bad all-in.
Yone|M,B|physical|fighter|sustained,dive,knockup|Use a prepared entry and track where your spirit return leaves your body.|A return point in enemy control can turn a successful trade into a death.
Yorick|B|physical|fighter|split|Prepare your summons and push a side lane when you know who can answer.|Grouping without your setup or splitting without vision can waste your pressure.
Yunara|D|mixed|marksman|sustained,scaling|Build a safe attack window before committing your enhanced form and keep allied protection nearby.|Early damage pressure and interruption can deny the sustained attacks you need.
Yuumi|S|magic|support|heal,shield,scaling|Support the ally who can use your protection and coordinate safe opportunities to refresh resources.|An unsupported lane or an isolated host can limit your ability to affect the map.
Zaahen|B|physical|fighter|sustained,sustain|Use measured close-range trades and choose fights where repeated contact is possible.|Kiting and coordinated burst can deny a prolonged fighting window.
Zac|J,B|magic|tank|frontline,engage,knockup|Use vision denial to set up a long-range entry and collect safe healing pickups.|A visible charge or interrupted entry can leave you unable to reach useful targets.
Zed|M|physical|assassin|poke,dive,mobile|Use ranged pressure to create a finishing window and track the safety of your shadow returns.|Spending all shadows aggressively can leave no exit after the burst.
Zeri|D|physical|marksman|sustained,mobile,scaling|Use movement to maintain a long fight and save terrain mobility for a planned route.|Reliable control and cramped routes can remove the spacing your damage relies on.
Ziggs|D,M|magic|mage|poke,waveclear,immobile|Use wave pressure to earn safe resets and convert a won lane into tower damage.|Pushing without vision makes your limited escape easy to punish.
Zilean|S,M|magic|support|peel,pick|Use speed control to protect a carry and time revival before lethal damage arrives.|A mistimed revival or missed stun setup can leave little immediate protection.
Zoe|M|magic|mage|poke,pick|Threaten sleep from an angle and use long-range follow-up rather than prolonged trades.|A predictable return position can be punished by ready enemy control.
Zyra|S|magic|mage|poke,peel,immobile|Use plants to contest space and keep root or ultimate available against an approach.|Pushing from an exposed position can make a fragile lane easy to gank.
`;

const lanes = { B: 'Baron', J: 'Jungle', M: 'Mid', D: 'Dragon', S: 'Support' };
const rowNames = rows.trim().split('\n').map(row => row.split('|')[0]);
if (new Set(rowNames).size !== rowNames.length) throw new Error('Duplicate champion row');
export const championGuides = Object.fromEntries(rows.trim().split('\n').map(row => {
  const [name, roles, damage, category, traits, plan, risk] = row.split('|');
  if (!risk) throw new Error(`Incomplete editorial guide: ${name}`);
  return [name, { lanes: roles.split(',').map(role => lanes[role]), damage, category, traits: traits.split(','), plan, risk }];
}));

// Only differences that affect this guide's role or broad strategy live here.
// These are conservative supported roles, not an exhaustive list of viable off-meta picks.
export const gameOverrides = {
  pc: { Corki: { damage: 'physical' }, Amumu: { lanes: ['Jungle', 'Support'] } },
  wr: {
    Nilah: { lanes: ['Dragon', 'Jungle'] },
    Nautilus: { lanes: ['Support', 'Jungle', 'Baron'] },
    Corki: { lanes: ['Mid', 'Dragon'] },
    Zyra: { lanes: ['Support', 'Mid'] },
    Fiddlesticks: { lanes: ['Jungle'] }
  }
};
