import type { MercenaryTemplate } from '../../types/mercenary'
import { warrior } from './3star/warrior'
import { archer } from './3star/archer'
import { arines } from './3star/arines'
import { tank } from './3star/tank'
import { mage } from './5star/mage'

const mercenaryMap = new Map<string, MercenaryTemplate>()

function register(merc: MercenaryTemplate) {
  mercenaryMap.set(merc.id, merc)
}

register(warrior)
register(archer)
register(arines)
register(tank)
register(mage)

export function getMercenaryById(id: string): MercenaryTemplate | undefined {
  return mercenaryMap.get(id)
}

export function getAllMercenaries(): MercenaryTemplate[] {
  return Array.from(mercenaryMap.values())
}

export function getMercenariesByStar(star: number): MercenaryTemplate[] {
  return Array.from(mercenaryMap.values()).filter((m) => m.star === star)
}
