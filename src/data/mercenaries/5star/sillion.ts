import type { MercenaryTemplate } from '../../../types/mercenary'

export const sillion: MercenaryTemplate = {
  id: 'sillion',
  name: '실리온',
  type: 'mage',
  star: 5,
  maxHp: 3115,
  atk: 2708,
  def: 10,
  emoji: '🔮',
  imageId: '4285',
  critRate: 20,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_third',
    attackRange: 'cross',
    effects: [
      { type: 'direct_damage', value: 1, debuffClass: 'stat_weaken', atkScaling: true },
      { type: 'stun', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'regeneration', value: 25, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 50, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
