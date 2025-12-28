const examples = {
    cubetory : `
# a schema of the various factories from Cubetory:
# https://store.steampowered.com/app/3027060/Cubetory/

throughput 1 per s

type bolt         = "-b-b-b-b-b-b"
type circuit      = "-c-c-c-c-c-c"
type construction = "-C-C-C-C-C-C"
type wire         = "-w-w-w-w-w-w"

stamp-bolt         : "R---------R-"           =(9s)=>  3x bolt
stamp-circuit      : "P-B-B-B-B-P-" + 3x bolt =(15s)=> circuit
stamp-construction : 2x bolt                  =(16s)=> 2x construction
stamp-wire         : "P-B-B-B-B-P-"           =(10s)=> 5x wire

stamp-circuit-ex   : 3x wire + 2x bolt + "R---------R-" + "P-B-B-B-B-P-" =(6s)=> 3x circuit
    `,
    starbase : `
# a schema containing a variety of crafting recipes from Super StarBase (v0.2.2):
# https://jamsnack.itch.io/super-starbase

# EQUIPMENT
bench-craft-repaired-pickaxe : broken-pickaxe + 5x wood + 4x stone ==> repaired-pickaxe
bench-craft-repaired-sword   : stick-blade + 4x wood + 5x stone ==> repaired-sword

bench-craft-slashleaf-helmet : 14x slash-leaf + 12x wood + 15x stick ==> slashleaf-helmet
bench-craft-slashleaf-tunic  : 20x slash-leaf + 20x wood + 8x stick ==> 1 x slashleaf-tunic
bench-craft-slashleaf-shoes  : 10x slash-leaf + 25x wood + 12x stick ==> slashleaf-shoes

anvil-craft-tangerine-helmet     : 18x tangerine-flesh ==> tangerine-helmet
anvil-craft-tangerine-shoes      : 20x tangerine-flesh ==> tangerine-shoes
anvil-craft-tangerine-chestpiece : 16x tangerine-flesh ==> tangerine-chestpiece

anvil-craft-copprin-helmet     : 20x copprin-bar ==> copprin-helmet
anvil-craft-copprin-chestpiece : 25x copprin-bar ==> copprin-chestpiece
anvil-craft-copprin-shoes      : 14x copprin-bar ==> copprin-shoes
anvil-craft-copprin-lantern    : 8x copprin-bar + 8x sand ==> copprin-lantern

anvil-craft-silven-helmet     : 20x silven-bar ==> silven-helmet
anvil-craft-silven-chestpiece : 25x silven-bar ==> silven-chestpiece
anvil-craft-silven-shoes      : 14x silven-bar ==> silven-shoes
anvil-craft-silven-lantern    : 10x silven-bar + 8x sand ==> silven-lantern

anvil-craft-gollan-helmet     : 20x gollan-bar ==> gollan-helmet
anvil-craft-gollan-chestpiece : 25x gollan-bar ==> gollan-chestpiece
anvil-craft-gollan-shoes      : 14x gollan-bar ==> gollan-shoes
anvil-craft-gollan-lantern    : 10x gollan-bar + 8x sand ==> gollan-lantern

anvil-craft-bubble-helmet  : 20x soapstone ==> bubble-helmet
anvil-craft-bubble-chest   : 25x soapstone ==> bubble-chest
anvil-craft-bubble-shoes   : 14x soapstone ==> bubble-shoes
anvil-craft-bubble-lantern : 10x soapstone + 8x sand ==> bubble-lantern

anvil-craft-void-helmet     : 10x void-essence ==> void-helmet
anvil-craft-void-chestpiece : 15x void-essence ==> void-chestpiece
anvil-craft-void-shoes      : 5x void-essence ==> void-shoes
anvil-craft-void-lantern    : 8x void-essence + 8x sand ==> void-lantern

anvil-craft-stardust-helmet     : 20x stardust ==> stardust-helmet
anvil-craft-stardust-chestpiece : 25x stardust ==> stardust-chestpiece
anvil-craft-stardust-shoes      : 14x stardust ==> stardust-shoes
anvil-craft-stardust-lantern    : 10x stardust + 8x sand ==> stardust-lantern

# PICKAXES
#craft-broken-pickaxe          : 3x stick + wood ==> broken-pickaxe
anvil-craft-copprin-pickaxe   : 3x stick + 2x wood + 8x copprin-bar ==> copprin-pickaxe
bench-craft-slashleaf-pickaxe : 3x stick + 2x wood + 24x slash-leaf ==> slashleaf-pickaxe
anvil-craft-silven-pickaxe    : 4x stick + 2x wood + 12x silven-bar ==> silven-pickaxe
anvil-craft-gollan-pickaxe    : 4x stick + 2x wood + 12x gollan-bar ==> gollan-pickaxe
#craft-metal-pickaxe           : broken-pickaxe + 4x stick + 8x metal ==> metal-pickaxe

# WEAPONS
anvil-craft-copprin-sword : 2x wood + 8x stick + 2x string + 16x copprin-bar ==> copprin-sword
anvil-craft-silven-sword  : 3x wood + 8x stick + 2x string + 16x silven-bar ==> silven-sword
anvil-craft-gollan-sword  : 2x silven-bar + 8x stick + 2x string + 16x gollan-bar ==> gollan-sword

bench-craft-wooden-bow : 4x stick + 2x string + wood ==> wooden-bow
#craft-stick-blade      : 4x stick + 2x string + wood ==> stick-blade

#craft-copprin-bow : 2x wood + 8x stick + 2x string + 16x copprin-bar ==> copprin-bow
#craft-silven-bow  : 3x wood + 8x stick + 2x string + 16x silven-bar ==> silven-bow
#craft-gollan-bow  : 2x silven-bar + 8x stick + 2x string + 16x gollan-bar ==> gollan-bow

#craft-metal-sword         : stick-blade + 3x wood + 8x stick + 16x metal ==> metal-sword
#craft-metal-bow           : wooden-bow + 3x wood + 8x stick + 16x metal ==> metal-bow
#bench-craft-slashleaf-bow : 16x wood + 24x stick + 16x slash-leaf ==> slashleaf-bow

bench-craft-slashleaf-dagger : 8x wood + 12x stick + 16x slash-leaf ==> slashleaf-dagger
anvil-craft-starglint-sword  : 25x stardust + 2x silven-bar ==> starglint-sword

anvil-craft-tanguranium-hammer : 20x tangerine-flesh ==> tanguranium-hammer
anvil-craft-tangerine-lantern  : 20x tangerine-flesh ==> tangerine-lantern
anvil-craft-tangerine-bow      : 20x tangerine-flesh ==> tangerine-bow

# FACTORY
anvil-craft-wire-light          : 2x sand ==> wire-light
craft-torch                     : 2x stick ==> torch
bench-craft-prim-furnace        : 8x stone ==> prim-furnace
craft-mud-furnace               : 2x packed-dirt + dirt ==> mud-furnace
anvil-craft-turret              : 2x copprin-bar ==> turret
bench-craft-turret-slashleaf    : 30x slash-leaf + 2x wood ==> turret-slashleaf
anvil-craft-turret-silven       : 3x silven-bar ==> turret-silven
craft-platform                  : 2x stick ==> platform
bench-craft-door                : 2x wood ==> door
bench-craft-chest               : 3x wood + 6x stick ==> chest
bench-craft-copprin-anvil       : 4x copprin-bar ==> copprin-anvil
craft-campfire                  : 5x wood + 12x stick ==> campfire
anvil-craft-generator-photosand : wood + 3x stick + 6x sand ==> generator-photosand
craft-workbench                 : 8x wood + 4x stick ==> workbench

# TILES
bench-craft-wood-tile     : wood ==> wood-tile
craft-packed-dirt         : 2x dirt ==> packed-dirt
bench-craft-packed-stone  : 2x stone ==> packed-stone
anvil-craft-metal-plating : silven-bar ==> metal-plating

# RESOURCES
craft-string    : thread-fruit ==> 2x string
craft-wood      : tree ==> 2x wood
craft-starshuck : 10x stardust ==> starshuck

# ACCESSORIES
bench-craft-medicinal-herb : 5x slash-leaf + 8x stardust ==> medicinal-herb
    `,
    minecraft : `
# a schema for the various ways to craft an iron pickaxe in Minecraft:
# https://minecraft.wiki/w/Iron_Pickaxe

throughput 1/10 per s

craft-iron-pickaxe : 3x iron + 2x stick ==> iron-pickaxe

# crafting
craft-iron-from-block   : iron-block ==> 9x iron
craft-iron-from-nuggets : 9x iron-nugget ==> iron

# smelting
smelt-iron-ore : 3x iron-ore + 2x plank =(30s)=> 3x iron + 2.1x exp
smelt-raw-iron : 3x raw-iron + 2x plank =(30s)=> 3x iron + 2.1x exp
smelt-iron-pickaxe : 3x iron-pickaxe + 2x plank =(30s)=> 3x iron-nugget + 0.3x exp

# wood
craft-planks : log ==> 4x plank
craft-sticks : 2x plank ==> 4x stick
    `,
};

for (const i in examples) {
    examples[i] = examples[i].trim();
}