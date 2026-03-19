import type { MercenaryTemplate } from '../../../types/mercenary'

export const minerva: MercenaryTemplate = {
  id: 'minerva',
  name: '미네르바',
  type: 'defender',
  star: 5,
  maxHp: 26428,
  atk: 1447,
  def: 10,
  emoji: '🛡️',
  imageId: '4745',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'temp_hp', value: 0.5, duration: 24, buffType: 'special', target: 'self' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
