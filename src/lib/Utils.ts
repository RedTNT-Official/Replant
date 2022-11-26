import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Block, BlockSource } from "bdsx/bds/block";
import { bool_t, int32_t } from "bdsx/nativetype";
import { ServerPlayer } from "bdsx/bds/player";
import { procHacker } from "bdsx/prochacker";
import { BlockPos } from "bdsx/bds/blockpos";
import { CANCEL } from "bdsx/common";
import { Event } from "bdsx/eventtarget";
import { join } from "path";

const configPath: string = join(process.cwd(), '..', 'config');
const path: string = join(configPath, 'Replant');
const file: string = join(path, 'configuration.json');

export function parse(): string[] {
    if (!existsSync(path)) dump([
        "minecraft:wheat",
        "minecraft:carrots",
        "minecraft:potatoes",
        "minecraft:beetroot"
    ]);
    try {
        return JSON.parse(readFileSync(file, 'utf8'));
    } catch (e) {
        console.log("[Replant] There's an error with the config file. Will use default configuration.".bgRed);
        return [];
    }
}

export function dump(content: string[], indent: number = 4): void {
    if (!existsSync(configPath)) mkdirSync(configPath);
    if (!existsSync(path)) mkdirSync(path);
    writeFileSync(file, JSON.stringify(content, null, indent));
}

const onUseBlock = procHacker.hooking('?use@Block@@QEBA_NAEAVPlayer@@AEBVBlockPos@@E@Z', bool_t, null, Block, ServerPlayer, BlockPos, int32_t)(
    (block, player, pos, n) => {
        if (blockInteract.fire(block, player, pos, player.getRegion()) === CANCEL) return false;
        return onUseBlock(block, player, pos, n);
    }
);

export const blockInteract = new Event<(
    block: Block,
    player: ServerPlayer,
    blockPos: BlockPos,
    source: BlockSource
) => void | CANCEL>();