import { blockInteract, parse } from "./lib/Utils";
import { CANCEL } from "bdsx/common";
import { Block } from "bdsx/bds/block";

blockInteract.on((block, player, pos, source) => {
    const { x, y, z } = pos;
    const blockName = block.getName();
    if (!parse().includes(blockName) || block.data < 7) return;

    player.runCommand(`setblock ${x} ${y} ${z} ${blockName} 0 destroy`);
    source.setBlock(pos, Block.create(blockName)!);
    return CANCEL;
});