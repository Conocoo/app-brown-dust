import type { MercenaryTemplate } from '../../../types/mercenary'

export const caim: MercenaryTemplate = {
  id: 'caim',
  name: '카임',
  type: 'attacker',
  star: 5,
  maxHp: 4352,
  atk: 641,
  def: 0,
  emoji: '⚔️',
  imageId: '4455',
  critRate: 50,
  critDamage: 50,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 1, buffType: 'stat_enhance', target: 'self' },
      { type: 'heal_boost', value: 1, duration: 10, debuffClass: 'stat_weaken' },
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
    ],
  },
}
