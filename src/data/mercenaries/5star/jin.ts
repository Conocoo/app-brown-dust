import type { MercenaryTemplate } from '../../../types/mercenary'

export const jin: MercenaryTemplate = {
  id: 'jin',
  name: '진',
  type: 'attacker',
  star: 5,
  maxHp: 5155,
  atk: 1243,
  def: 5,
  emoji: '⚔️',
  imageId: '2325',
  critRate: 10,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, duration: 999, buffType: 'special', target: 'self' },
      { type: 'dot', value: 1.5, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
