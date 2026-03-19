import type { MercenaryTemplate } from '../../../types/mercenary'

export const swin: MercenaryTemplate = {
  id: 'swin',
  name: '스윈',
  type: 'attacker',
  star: 4,
  maxHp: 3642,
  atk: 1052,
  def: 0,
  emoji: '⚔️',
  imageId: '4225',
  critRate: 10,
  critDamage: 50,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 30, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.4, debuffClass: 'dot', atkScaling: true },
      { type: 'revival', value: 0, duration: 18, debuffClass: 'stat_weaken' },
    ],
  },
}
