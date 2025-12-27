const examples = {
    hello : "throughput 1/s",
    cubetory : `
throughput 1/s

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
# EQUIPMENT
bench-craft-repaired-pickaxe : 1x broken-pickaxe + 5x wood + 4x stone ==> 1x repaired-pickaxe
bench-craft-repaired-sword : 1x stick-blade + 4x wood + 5x stone ==> 1x repaired-sword

bench-craft-slashleaf-helmet : 14x slash-leaf + 12x wood + 15x stick ==> 1x slashleaf-helmet
bench-craft-slashleaf-tunic : 20x slash-leaf + 20x wood + 8x stick ==> 1 x slashleaf-tunic
bench-craft-slashleaf-shoes : 10x slash-leaf + 25x wood + 12x stick ==> 1x slashleaf-shoes

anvil-craft-tangerine-helmet : 18x tangerine-flesh ==> 1x tangerine-helmet
anvil-craft-tangerine-shoes : 20x tangerine-flesh ==> 1x tangerine-shoes
anvil-craft-tangerine-chestpiece : 16x tangerine-flesh ==> 1x tangerine-chestpiece

anvil-craft-copprin-helmet : 20x copprin-bar ==> 1x copprin-helmet
anvil-craft-copprin-chestpiece : 25x copprin-bar ==> 1x copprin-chestpiece
anvil-craft-copprin-shoes : 14x copprin-bar ==> 1x copprin-shoes
anvil-craft-copprin-lantern : 8x copprin-bar + 8x sand ==> 1x copprin-lantern

anvil-craft-silven-helmet : 20x silven-bar ==> 1x silven-helmet
anvil-craft-silven-chestpiece : 25x silven-bar ==> 1x silven-chestpiece
anvil-craft-silven-shoes : 14x silven-bar ==> 1x silven-shoes
anvil-craft-silven-lantern : 10x silven-bar + 8x sand ==> 1x silven-lantern

anvil-craft-gollan-helmet : 20x gollan-bar ==> 1x gollan-helmet
anvil-craft-gollan-chestpiece : 25x gollan-bar ==> 1x gollan-chestpiece
anvil-craft-gollan-shoes : 14x gollan-bar ==> 1x gollan-shoes
anvil-craft-gollan-lantern : 10x gollan-bar + 8x sand ==> 1x gollan-lantern

anvil-craft-bubble-helmet : 20x soapstone ==> 1x bubble-helmet
anvil-craft-bubble-chest : 25x soapstone ==> 1x bubble-chest
anvil-craft-bubble-shoes : 14x soapstone ==> 1x bubble-shoes
anvil-craft-bubble-lantern : 10x soapstone + 8x sand ==> 1x bubble-lantern

anvil-craft-void-helmet : 10x void-essence ==> 1x void-helmet
anvil-craft-void-chestpiece : 15x void-essence ==> 1x void-chestpiece
anvil-craft-void-shoes : 5x void-essence ==> 1x void-shoes
anvil-craft-void-lantern : 8x void-essence + 8x sand ==> 1x void-lantern

anvil-craft-stardust-helmet : 20x stardust ==> 1x stardust-helmet
anvil-craft-stardust-chestpiece : 25x stardust ==> 1x stardust-chestpiece
anvil-craft-stardust-shoes : 14x stardust ==> 1x stardust-shoes
anvil-craft-stardust-lantern : 10x stardust + 8x sand ==> 1x stardust-lantern

# PICKAXES
#craft-broken-pickaxe : 3x stick + 1x wood ==> 1x broken-pickaxe
anvil-craft-copprin-pickaxe : 3x stick + 2x wood + 8x copprin-bar ==> 1x copprin-pickaxe
bench-craft-slashleaf-pickaxe : 3x stick + 2x wood + 24x slash-leaf ==> 1x slashleaf-pickaxe
anvil-craft-silven-pickaxe : 4x stick + 2x wood + 12x silven-bar ==> 1x silven-pickaxe
anvil-craft-gollan-pickaxe : 4x stick + 2x wood + 12x gollan-bar ==> 1x gollan-pickaxe
#craft-metal-pickaxe : 1x broken-pickaxe + 4x stick + 8x metal ==> 1x metal-pickaxe

# WEAPONS
anvil-craft-copprin-sword : 2x wood + 8x stick + 2x string + 16x copprin-bar ==> 1x copprin-sword
anvil-craft-silven-sword : 3x wood + 8x stick + 2x string + 16x silven-bar ==> 1x silven-sword
anvil-craft-gollan-sword : 2x silven-bar + 8x stick + 2x string + 16x gollan-bar ==> 1x gollan-sword

bench-craft-wooden-bow : 4x stick + 2x string + 1x wood ==> 1x wooden-bow
#craft-stick-blade : 4x stick + 2x string + 1x wood ==> 1x stick-blade

#craft-copprin-bow : 2x wood + 8x stick + 2x string + 16x copprin-bar ==> 1x copprin-bow
#craft-silven-bow : 3x wood + 8x stick + 2x string + 16x silven-bar ==> 1x silven-bow
#craft-gollan-bow : 2x silven-bar + 8x stick + 2x string + 16x gollan-bar ==> 1x gollan-bow

#craft-metal-sword : 1x stick-blade + 3x wood + 8x stick + 16x metal ==> 1x metal-sword
#craft-metal-bow : 1x wooden-bow + 3x wood + 8x stick + 16x metal ==> 1x metal-bow
#bench-craft-slashleaf-bow : 16x wood + 24x stick + 16x slash-leaf ==> 1x slashleaf-bow

bench-craft-slashleaf-dagger : 8x wood + 12x stick + 16x slash-leaf ==> 1x slashleaf-dagger
anvil-craft-starglint-sword : 25x stardust + 2x silven-bar ==> 1x starglint-sword

anvil-craft-tanguranium-hammer : 20x tangerine-flesh ==> 1x tanguranium-hammer
anvil-craft-tangerine-lantern : 20x tangerine-flesh ==> 1x tangerine-lantern
anvil-craft-tangerine-bow : 20x tangerine-flesh ==> 1x tangerine-bow

# FACTORY
anvil-craft-wire-light : 2x sand ==> 1x wire-light
craft-torch : 2x stick ==> 1x torch
bench-craft-prim-furnace : 8x stone ==> 1x prim-furnace
craft-mud-furnace : 2x packed-dirt + 1x dirt ==> 1x mud-furnace
anvil-craft-turret : 2x copprin-bar ==> 1x turret
bench-craft-turret-slashleaf : 30x slash-leaf + 2x wood ==> 1x turret-slashleaf
anvil-craft-turret-silven : 3x silven-bar ==> 1x turret-silven
craft-platform : 2x stick ==> 1x platform
bench-craft-door : 2x wood ==> 1x door
bench-craft-chest : 3x wood + 6x stick ==> 1x chest
bench-craft-copprin-anvil : 4x copprin-bar ==> 1x copprin-anvil
craft-campfire : 5x wood + 12x stick ==> 1x campfire
anvil-craft-generator-photosand : 1x wood + 3x stick + 6x sand ==> 1x generator-photosand
craft-workbench : 8x wood + 4x stick ==> 1x workbench

# TILES
bench-craft-wood-tile : 1x wood ==> 1x wood-tile
craft-packed-dirt : 2x dirt ==> 1x packed-dirt
bench-craft-packed-stone : 2x stone ==> 1x packed-stone
anvil-craft-metal-plating : 1x silven-bar ==> 1x metal-plating

# RESOURCES
craft-string : 1x thread-fruit ==> 2x string
craft-wood : 1x tree ==> 2x wood
craft-starshuck : 10x stardust ==> 1x starshuck

# ACCESSORIES
bench-craft-acc-medicinal-herb : 5x slash-leaf + 8x stardust ==> 1x acc-medicinal-herb
    `,
};

for (const i in examples) {
    examples[i] = examples[i].trim();
}