import type { MercenaryTemplate } from '../../../types/mercenary'

export const alec: MercenaryTemplate = {
  id: 'alec',
  name: '알렉',
  type: 'attacker',
  star: 5,
  maxHp: 6115,
  atk: 6681,
  def: 0,
  emoji: '⚔️',
  imageId: '1775',
  critRate: 10,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_30', value: 2.7, debuffClass: 'dot' },
      { type: 'dot_direct', value: 1.2, debuffClass: 'dot' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
