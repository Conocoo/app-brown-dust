import type { MercenaryTemplate } from '../../../types/mercenary'

export const victor: MercenaryTemplate = {
  id: 'victor',
  name: '빅터',
  type: 'attacker',
  star: 5,
  maxHp: 2474,
  atk: 2069,
  def: 0,
  emoji: '⚔️',
  imageId: '3335',
  critRate: 15,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
    ],
  },
}
