import type { MercenaryTemplate } from '../../../types/mercenary'

export const karg: MercenaryTemplate = {
  id: 'karg',
  name: '카르그',
  type: 'attacker',
  star: 3,
  maxHp: 3510,
  atk: 1001,
  def: 5,
  emoji: '⚔️',
  imageId: '545',
  critRate: 15,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot', value: 1, debuffClass: 'dot' },
      { type: 'on_death_trigger', value: 0, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
