import type { MercenaryTemplate } from '../../../types/mercenary'

export const ymir: MercenaryTemplate = {
  id: 'ymir',
  name: '이미르',
  type: 'defender',
  star: 5,
  maxHp: 52248,
  atk: 4421,
  def: 60,
  emoji: '🛡️',
  imageId: '1715',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'summon', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_down', value: 40, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 100, duration: 4, debuffClass: 'stat_weaken' },
    ],
  },
}
