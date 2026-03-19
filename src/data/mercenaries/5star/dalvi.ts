import type { MercenaryTemplate } from '../../../types/mercenary'

export const dalvi: MercenaryTemplate = {
  id: 'dalvi',
  name: '달비',
  type: 'attacker',
  star: 5,
  maxHp: 3918,
  atk: 1065,
  def: 0,
  emoji: '⚔️',
  imageId: '2975',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_death_trigger', value: 0, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_direct', value: 1.5, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
