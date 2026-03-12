import type { MercenaryTemplate } from '../../types/mercenary'
import { cordelia } from './3star/cordelia'
import { liznet } from './3star/liznet'
import { arines } from './3star/arines'
import { carlson } from './3star/carlson'
import { maria } from './3star/maria'
import { maya } from './3star/maya'
import { wiggle } from './3star/wiggle'

const mercenaryMap = new Map<string, MercenaryTemplate>()

function register(merc: MercenaryTemplate) {
  mercenaryMap.set(merc.id, merc)
}

register(cordelia)
register(liznet)
register(arines)
register(carlson)
register(maria)
register(maya)
register(wiggle)

export function getMercenaryById(id: string): MercenaryTemplate | undefined {
  return mercenaryMap.get(id)
}

export function getAllMercenaries(): MercenaryTemplate[] {
  return Array.from(mercenaryMap.values())
}

export function getMercenariesByStar(star: number): MercenaryTemplate[] {
  return Array.from(mercenaryMap.values()).filter((m) => m.star === star)
}
